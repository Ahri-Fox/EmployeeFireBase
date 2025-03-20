import React, { useState } from 'react'
import './ProfileUser.css'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { EditOutlined, RollbackOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { updateUserProfile } from '../../redux/slice/userSlice'
import LeafletMap from '../../components/map/LeafletMap';
import { useHistory } from 'react-router-dom';


const ProfileUser: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory()
    const [isEditing, setIsEditing] = useState(false);
    const [searchAddress, setSearchAddress] = useState("");
    const [triggerSearch, setTriggerSearch] = useState(false)
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const formik = useFormik({
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            address: user?.address || '',
            avatarUrl: user?.avatarUrl || ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            address: Yup.string().required('Address is required')
        }),
        onSubmit: (values) => {
            dispatch(updateUserProfile({ id: user.id, data: values }))
            setIsEditing(false);
        }
    });

    const handleAddressChange = (newAddress: string) => {
        formik.setFieldValue('address', newAddress);
        setSearchAddress(newAddress)
    };

    const handleMapSearch = (address: string) => {
        setTriggerSearch((prev) => !prev); // Kích hoạt tìm kiếm bằng cách thay đổi giá trị triggerSearch
    };


    return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row d-flex justify-content-center m-auto">
                    <div className="col-xl-6 col-md-12">
                        <div className="card user-card-full">
                            <div className="row m-l-0 m-r-0" style={{ flex: '1' }}>
                                <div className="col-sm-4 bg-c-lite-green user-profile">
                                    <div className="card-block text-center text-white">
                                        <div className="m-b-25">
                                            <img src={user.avatarUrl} className="avatar img-radius" alt="User-Profile-Image" />
                                        </div>
                                        <h6 className="f-w-600">{user?.name || "No Name"}</h6>
                                        <p>{user?.email || "No Email"}</p>
                                        <span><EditOutlined className='pt-3' style={{ height: '50px', width: '50px', justifyContent: "center", cursor: 'pointer' }} onClick={handleEditClick} /></span>
                                        <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16" />
                                    </div>
                                </div>
                                <div className="col-sm-8">
                                    <div className="card-block">
                                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600 position-relative">Information <span className="position-absolute" style={{ right: '1px', cursor: 'pointer' }} onClick={() => history.goBack()}><RollbackOutlined /></span></h6>

                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="row pb-5">
                                                <div className="col-sm-3">
                                                    <p className="m-b-10 f-w-600">Name</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="form-control"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.name}
                                                        />
                                                    ) : (
                                                        <h6 className="text-muted f-w-400">{user?.name || "No Name"}</h6>
                                                    )}
                                                </div>
                                                <div className="col-sm-4">
                                                    <p className="m-b-10 f-w-600">Email</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.email}
                                                        />
                                                    ) : (
                                                        <h6 className="text-muted f-w-400">{user?.email || "No Email"}</h6>
                                                    )}
                                                </div>
                                                <div className="col-sm-5">
                                                    <p className="m-b-10 f-w-600">Image</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="avatarUrl"
                                                            className="form-control"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.avatarUrl}
                                                        />
                                                    ) : (
                                                        <h6 className="text-muted f-w-400 ">{user?.avatarUrl || "No Image"}</h6>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="row pb-5">
                                                <div className="col-sm-12">
                                                    <p className="m-b-10 f-w-600">Location</p>
                                                    {isEditing ? (
                                                        <>
                                                            <div className='d-flex align-items-center mt-3'>
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    className="form-control"
                                                                    onChange={(e) => setSearchAddress(e.target.value)}
                                                                    placeholder="Nhập địa chỉ..."
                                                                    value={searchAddress}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleMapSearch(searchAddress)}
                                                                    style={{ padding: '6px', marginLeft: '10px' }}
                                                                >
                                                                    Tìm kiếm
                                                                </button>
                                                            </div>
                                                            <LeafletMap
                                                                onAddressChange={handleAddressChange}
                                                                searchAddress={searchAddress}
                                                                triggerSearch={triggerSearch}
                                                            />
                                                        </>
                                                    ) : (
                                                        <h6 className="text-muted f-w-400">{user?.address || "No Address"}</h6>
                                                    )}
                                                </div>
                                            </div>



                                            {isEditing ? (
                                                <div>
                                                    <button type="submit" className="btn btn-primary">Save</button>
                                                    <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                                                </div>
                                            ) : null}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default ProfileUser