import mysql2 from 'mysql2/promise';

const config = {
    host: '192.168.109.21',
    user: 'root',
    password: 'ACCA2020',
    database: 'bc365',
    connectionLimit: 10,
    maxIdle: 10,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
    maxPreparedStatements: 0,
};

const pool = mysql2.createPool(config);

/**
 * Executes a SQL query using a connection from the connection pool.
 *
 * @param {string} query - The SQL query to be executed.
 * @returns {Promise<Object>} A promise that resolves to an object containing the rows and fields of the result.
 * @throws Will throw an error if the query execution fails.
 */

const executeQuery = async (query) => {
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query(query);
        connection.release();
        return { rows, fields };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};
const error = {
    1054: 'Column does not exist',
    1062: 'Duplicate entry',
    1146: 'Table not found',
    1049: 'Unknown database',
    1045: 'Access denied for user',
    2002: 'Cannot connect to database',
    2003: "Can't connect to MySQL server",
    2006: 'MySQL server has gone away',
    2013: 'Lost connection to MySQL server during query',
    2054: 'The server requested authentication method unknown to the client',
    2055: 'The client does not support authentication protocol requested by server',
};
const errorPrettier = (errno) => {
    return error[errno] || 'Unknown error ' + errno;
};
export const getQueryString = ({ tableObject, data, mode = 'new' }) => {
    const tableName = tableObject.name;
    const fieldsOfDefineTable = tableObject.fields;
    //* -------------------- GET FIELD & VALUE OF DEFINE TABLE ------------------- */
    const SQLfieldsKeys = Object.keys(fieldsOfDefineTable);
    const fields = SQLfieldsKeys.map((field) => `\`${field}\``).join(', '); // Wrap each field in backticks
    //* ------------------------- GET VALUE OF KEY IN API ------------------------ */
    const APIFieldsKeys = Object.values(fieldsOfDefineTable);
    const values = APIFieldsKeys.map((field) => {
        const value = data[field];
        if (value === undefined || value === null) {
            return 'NULL';
        }
        if (
            field === 'system_modified_at' ||
            field === 'SystemModifiedAt' ||
            field === 'Updated_at' ||
            field === 'StartingDateTime' ||
            field === 'EndingDateTime'
        ) {
            return `'${transformISOToDateTime(value)}'`;
        }
        switch (typeof value) {
            case 'boolean':
                return value ? 1 : 0;
            case 'number':
                return value;
            case 'string':
                return mysql2.escape(value); // escape string
            default:
                return mysql2.escape(JSON.stringify(value)); // escape and stringify other types
        }
    });
    const valuesToSql = values.join(', ');
    if (mode === 'update') {
        const updateValues = SQLfieldsKeys.map((field, index) => {
            return `\`${field}\` = ${values[index]}`; // Wrap field in backticks for updates
        });
        const queryString = `UPDATE ${tableName} SET ${updateValues.join(
            ', '
        )} WHERE systemId = '${data['SystemId']}'`;
        return queryString;
    }

    const queryString = `INSERT INTO ${tableName} ( ${fields}  ) VALUES ( ${valuesToSql}  )`;
    return queryString;
};
function transformISOToDateTime(isoString) {
    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Function to pad single digit numbers with a leading zero
    const pad = (num) => (num < 10 ? '0' : '') + num;

    // Format the date to 'YYYY-MM-DD HH:MM:SS'
    const formattedDate = `${date.getFullYear()}-${pad(
        date.getMonth() + 1
    )}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
        date.getMinutes()
    )}:${pad(date.getSeconds())}`;

    return formattedDate;
}
export { executeQuery, pool, errorPrettier, transformISOToDateTime };
