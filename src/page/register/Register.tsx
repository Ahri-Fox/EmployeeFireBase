import React from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { registerUser } from '../../redux/slice/userSlice'
import { displayLoading, hideLoading } from '../../redux/slice/loadingSlice'
import { message } from 'antd'
import { useHistory } from 'react-router-dom'
import style from '../login/style.module.css'


const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const history = useHistory()
    const [messageApi, contextHolder] = message.useMessage();
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên không được để trống"),
            email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
            password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(displayLoading())
                await dispatch(registerUser({
                    email: values.email,
                    password: values.password,
                    name: values.name,
                    address: "Chưa có địa chỉ"
                }))

                messageApi.success("Register successfully!");
                setTimeout(() => {
                    history.push("/login");
                }, 500);
            } catch (error) {
                messageApi.error("Failed to register!");

            } finally {
                dispatch(hideLoading())
            }
        },
    })


    return (
        <div style={{ width: "50%" }}>
            {contextHolder}
            <div className={style.w3layoutscontaineragileits}>
                <h2 style={{ color: 'white' }}>Register </h2>
                <form onSubmit={formik.handleSubmit}>
                    <input style={{ color: 'white' }} type="text" name="name" placeholder="NAME" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.name && formik.errors.name && <span>{formik.errors.name}</span>}
                    </div>

                    <input style={{ color: 'white' }} type="email" name="email" placeholder="EMAIL" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}
                    </div>

                    <input style={{ color: 'white' }} type="password" name="password" placeholder="PASSWORD" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.password && formik.errors.password && <span>{formik.errors.password}</span>}
                    </div>

                    <input style={{ color: 'white' }} type="password" name="confirmPassword" placeholder="CONFIRM PASSWORD" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <span>{formik.errors.confirmPassword}</span>}
                    </div>


                    <div className={style.aitssendbuttonw3ls}>
                        <input type="submit" defaultValue="REGISTER" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
