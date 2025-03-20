import React from 'react';
import {
    Button,
    Form,
    Input,
    message,
    Switch,
} from 'antd';
import * as Yup from "yup"
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createEmployee } from '../../redux/slice/employeeSlice';
import { useHistory } from 'react-router-dom';

const AddEmployee: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const history = useHistory()
    const [messageApi, contextHolder] = message.useMessage();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            img: '',
            isAvailable: false,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên không được để trống"),
            email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
        }),
        onSubmit: async (values) => {
            try {
                await dispatch(createEmployee(values)).unwrap()
                messageApi.success("Employee created successfully!")
                setTimeout(() => {
                    history.push("/listemployee");
                }, 500);
            } catch (error) {
                messageApi.error("Failed to create employee. Please try again!")
            }
        }
    })

    return (
        <div>
            {contextHolder}
            <h2 className='pb-4' style={{ textAlign: "left" }}>Add employee</h2>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 800 }}
                onFinish={formik.handleSubmit}
            >

                <Form.Item label="Name">
                    <Input style={{ width: '100%', height: '10px', border: '1px solid black' }}
                        name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.name && formik.errors.name && <span>{formik.errors.name}</span>}
                    </div>
                </Form.Item>

                <Form.Item label="Email">
                    <Input style={{ width: '100%', height: '10px', border: '1px solid black' }}
                        name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}
                    </div>
                </Form.Item>
                <Form.Item label="Img">
                    <Input style={{ width: '100%', height: '10px', border: '1px solid black' }}
                        name='img' value={formik.values.img} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </Form.Item>

                <Form.Item label="isAvailable" valuePropName="checked">
                    <Switch
                        checked={formik.values.isAvailable}
                        onChange={(checked) => formik.setFieldValue("isAvailable", checked)} />
                </Form.Item>

                <Form.Item label="Button">
                    <Button htmlType="submit">ADD EMPLOYEE</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddEmployee
