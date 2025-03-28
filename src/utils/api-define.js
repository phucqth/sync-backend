import {
    tbl_50100,
    tbl_50101,
    tbl_50125,
    tbl_50126,
    tbl_50128,
    tbl_50130,
    tbl_50131,
    tbl_50132,
    tbl_50133,
    tbl_50136,
    tbl_50139,
    tbl_50141,
    tbl_50151,
    tbl_50153,
    tbl_50154,
    tbl_50155,
    tbl_50156,
    tbl_50183,
    tbl_50184,
    tbl_50188,
    tbl_50189,
    tbl_50232,
    tbl_50234,
    tbl_50255,
    tbl_27,
    tbl_36,
    tbl_38,
    tbl_18,
    tbl_5405,
    tbl_5406,
    tbl_5407,
    tbl_5409,
    tbl_99000771,
    tbl_99000772,
    tbl_sft_message,
} from '@models/index.js';
import tbl_50223 from '@models/tbl_50223.js';
export const apiDefineList = [
    {
        apiType: 'API1',
        name: 'SOM',
        main: {
            name: 'tbl_50183_bsv_acc_som_header',
            table: tbl_50183,
        },
        childs: [
            {
                key: 'Details',
                name: 'tbl_50184_bsv_acc_som_line',
                table: tbl_50184,
            },
        ],
    },
    {
        apiType: 'API2',
        name: 'SOP',
        main: {
            name: 'tbl_50188_bsv_acc_sop_header',
            table: tbl_50188,
        },
        childs: [
            {
                key: 'Details',
                name: 'tbl_50189_bsv_acc_sop_line',
                table: tbl_50189,
            },
        ],
    },
    {
        apiType: 'API3',
        name: 'SpOP Gravure',
        main: {
            name: 'tbl_50132_bsv_acc_spop',
            table: tbl_50132,
        },
        childs: [
            {
                key: 'PressPrintCylinders',
                name: 'tbl_50136_bsv_acc_spop_print_cylinder',
                table: tbl_50136,
            },
            {
                key: 'ExtrusionDetails',
                name: 'tbl_50141_bsv_acc_spop_extrusion',
                table: tbl_50141,
            },
            {
                key: 'ScapDetails',
                name: 'tbl_50139_bsv_acc_spop_scrap',
                table: tbl_50139,
            },
            {
                key: 'SolventDetails',
                name: 'tbl_50223_bsv_acca_solvent',
                table: tbl_50223,
            },
            {
                key: 'PouchingRemarksDetails',
                name: 'tbl_50133_bsv_acc_spop_remark',
                table: tbl_50133,
            },
            {
                key: 'LaminationRemarksDetails',
                name: 'tbl_50133_bsv_acc_spop_remark',
                table: tbl_50133,
            },
            {
                key: 'PressRemarksDetails',
                name: 'tbl_50223_bsv_acca_solvent',
                table: tbl_50133,
            },
        ],
    },
    {
        apiType: 'API4',
        name: 'Purchase Header',
        main: {
            name: 'tbl_38_purchase_header',
            table: tbl_38,
        },
    },
    {
        apiType: 'API5',
        name: 'Sales Header',
        main: {
            name: 'tbl_36_sales_header',
            table: tbl_36,
        },
    },
    {
        apiType: 'API6',
        name: 'Sales return orders',
        main: {
            name: 'tbl_36_sales_header',
            table: tbl_36,
        },
    },
    {
        apiType: 'API7',
        name: 'Prod. Order',
        main: {
            name: 'tbl_5405_production_order',
            table: tbl_5405,
        },
        childs: [
            {
                key: 'ProdOrderLine',
                name: 'tbl_5406_prod__order_line',
                table: tbl_5406,
            },
            {
                key: 'ProdOrderComponent',
                name: 'tbl_5407_prod__order_component',
                table: tbl_5407,
            },
            {
                key: 'ProdOrderRouting',
                name: 'tbl_5409_prod__order_routing_line',
                table: tbl_5409,
            },
        ],
    },
    {
        apiType: 'API8',
        name: 'Change Control Request',
        main: {
            name: 'tbl_50151_bsv_acc_change_control_request',
            table: tbl_50151,
        },
        childs: [
            {
                key: 'ReleasedProdOrder',
                name: 'tbl_50255_bsv_acc_ccr_line',
                table: tbl_50255,
            },
            {
                key: 'RelativeDeptDetails',
                name: 'tbl_50153_bsv_acc_ccr_relative_dept',
                table: tbl_50153,
            },
            {
                key: 'RelativeDeptIssueDetails',
                name: 'tbl_50153_bsv_acc_ccr_relative_dept',
                table: tbl_50153,
            },
            {
                key: 'PressFollowActions',
                name: 'tbl_50154_bsv_acc_ccr_follow_actions',
                table: tbl_50154,
            },
            {
                key: 'ApprovalsDetails',
                name: 'tbl_50155_bsv_acc_ccr_approval',
                table: tbl_50155,
            },
            {
                key: 'CollaboratorsDetails',
                name: 'tbl_50156_bsv_acc_ccr_collaborators',
                table: tbl_50156,
            },
        ],
    },
    {
        apiType: 'API15',
        name: 'Items',
        main: {
            name: 'tbl_27_item',
            table: tbl_27,
        },
    },
    {
        apiType: 'API16',
        name: 'Customer',
        main: {
            name: 'tbl_18_customer',
            table: tbl_18,
        },
    },
    {
        name: 'SpOP Flexo',
        apiType: 'API17',
        main: {
            name: 'tbl_50232_bsv_acc_spop_flexo',
            table: tbl_50232,
        },
        childs: [
            {
                key: 'SolventDetails',
                name: 'tbl_50234_bsv_acc_spop_flexo_solvent',
                table: tbl_50234,
            },
            {
                key: 'LaminationRemarksDetails',
                name: 'tbl_50133_bsv_acc_spop_remark',
                table: tbl_50133,
            },
            {
                key: 'PouchingRemarksDetails',
                name: 'tbl_50133_bsv_acc_spop_remark',
                table: tbl_50133,
            },
        ],
    },
    {
        name: 'Graphic Art Gravure',
        apiType: 'API18',
        main: {
            name: 'tbl_50125_bsv_acc_graphic_art_gravure',
            table: tbl_50125,
        },
        childs: [
            {
                key: 'ColorDetails',
                name: 'tbl_50126_bsv_acc_graphic_gravure_color',
                table: tbl_50126,
            },
            {
                key: 'RemarksDetails',
                name: 'tbl_50128_bsv_acc_graphic_gravure_remark',
                table: tbl_50128,
            },
            {
                key: 'PrintersDetails',
                name: 'tbl_50130_bsv_acc_ga_gravure_printer',
                table: tbl_50130,
            },
            {
                key: 'InkConsumpDetails',
                name: 'tbl_50131_bsv_acc_ga_gravure_ink_consump',
                table: tbl_50131,
            },
        ],
    },
    {
        name: 'Graphic Art Flexo',
        apiType: 'API19',
        main: {
            name: 'tbl_50100_bsv_acc_graphic_art_flexo',
            table: tbl_50100,
        },
        childs: [
            {
                key: 'ColorDetails',
                name: 'tbl_50101_bsv_acc_graphic_color',
                table: tbl_50101,
            },
        ],
    },
    {
        apiType: 'PRODBOM',
        serviceName: 'ACCAServices',
        name: 'Production BOM',
        main: {
            name: 'tbl_99000771_production_bom_header',
            table: tbl_99000771,
        },
        childs: [
            {
                key: 'Details',
                name: 'tbl_99000772_production_bom_line',
                table: tbl_99000772,
            },
        ],
    },
];
