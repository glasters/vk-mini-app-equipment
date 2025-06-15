import React, { useRef, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useReactToPrint } from 'react-to-print';
import AdminEquipmentTable from './AdminEquipmentTable';
import ActTransmission from './ActTransmission';
import ActReception from './ActReception';

const initialRows = [
    { id: 1, name: 'Чёрный Сергей', status: 'Оплачено', date: '2025-06-15' },
    { id: 2, name: 'Антонов Сергей', status: 'Сдано', date: '2025-06-14' },
];

export default function AdminApplicationTable2() {
    const [rows] = useState(initialRows);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const printRef = useRef();

    const handleOpenModal = (id) => () => {
        setSelectedRowId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRowId(null);
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Документы по заявке',
        removeAfterPrint: true,
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'ФИО', width: 200 },
        { field: 'status', headerName: 'Статус', width: 180 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Действия',
            width: 150,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="Просмотр"
                    onClick={handleOpenModal(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<PrintIcon />}
                    label="Печать"
                    onClick={() => {
                        setSelectedRowId(id);
                        setTimeout(handlePrint, 0);
                    }}
                    color="primary"
                />,
            ],
        },
    ];

    const selectedRow = rows.find((row) => row.id === selectedRowId);

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5]}
                />
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        maxHeight: '80vh',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Снаряжение для заявки #{selectedRowId}
                    </Typography>
                    {selectedRow && (
                        <>
                            <Typography>ФИО: {selectedRow.name}</Typography>
                            <Typography>Статус: {selectedRow.status}</Typography>
                        </>
                    )}
                    <AdminEquipmentTable
                        applicationId={selectedRowId}
                        onDataChange={setEquipment}
                    />
                </Box>
            </Modal>

            <div style={{ display: 'none' }}>
                <Box ref={printRef}>
                    {selectedRow && (
                        <>
                            <ActTransmission
                                application={{ id: selectedRow.id, userFullName: selectedRow.name, date: selectedRow.date }}
                                equipment={equipment}
                            />
                            <div style={{ pageBreakBefore: 'always' }} />
                            <ActReception
                                application={{ id: selectedRow.id, userFullName: selectedRow.name, date: selectedRow.date }}
                                equipment={equipment}
                            />
                        </>
                    )}
                </Box>
            </div>
        </>
    );
}