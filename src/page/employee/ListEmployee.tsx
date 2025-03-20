import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { InputRef, TableColumnsType, TableColumnType, message } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { EmployeeModel } from '../../models/EmployeeModels';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getAllListEmployees, removeEmployee, startListeningEmployees } from '../../redux/slice/employeeSlice';




type DataIndex = keyof EmployeeModel;

const ListEmployee: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const employees = useSelector((state: RootState) => state.employees.employees || []);
    const [messageApi, contextHolder] = message.useMessage();



    useEffect(() => {
        if (!employees.length) {
            dispatch(getAllListEmployees());

        }
        dispatch(startListeningEmployees());
    }, [dispatch, employees.length]);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<EmployeeModel> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: "#ffc069" }}>{text}</span>
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<EmployeeModel> = [

        {
            title: 'Img',
            dataIndex: 'img',
            key: 'img',
            width: '20%',
            render: (imgUrl: string, record) => {
                return (
                    <img
                        src={record.img}
                        alt="employee"
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: '5px',
                        }}
                    />
                );
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Available',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            width: '20%',
            ...getColumnSearchProps('isAvailable'),
            render: (isAvailable: boolean) => (isAvailable ? "Yes" : "No"),
        },
        {
            title: "",
            key: "action",
            width: "10%",
            render: (text: string, record: EmployeeModel) => (
                <Space size="middle">
                    <NavLink to={`/listemployee/updateemployee/${record.id}`}>
                        <button className="btn btn-primary">
                            <EditOutlined />
                        </button>
                    </NavLink>

                    <button onClick={async () => {
                        try {
                            await
                                dispatch(removeEmployee(record.id)).unwrap()
                            messageApi.success("Employee deleted successfully!")
                        } catch (error) {
                            messageApi.error("Failed to delete employee. Please try again!")
                        }
                    }}
                        className="btn btn-danger">
                        <DeleteOutlined />
                    </button>
                </Space>
            ),
        },

    ];

    return (
        <>
            {contextHolder}
            <Table<EmployeeModel> columns={columns} dataSource={employees} pagination={{ pageSize: 7 }} />
        </>
    )
}

export default ListEmployee
