import React, { useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import Resume from '../../../components/editdoc/Resume';
import Certifications from '../../../components/editdoc/Certifications';
import Driver from '../../../components/editdoc/Driver';
import Professional from '../../../components/editdoc/Professional';
import Other from '../../../components/editdoc/Other';
import EditFile from './File';
import apiClient from '../../../api/apiClient';
import { Loader } from '../../../components/Loader/loader';
import { selectUser } from '../../../redux/userSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';


function EditDocument({ card, index, setIsEditingDocument, userprofile,setUserprofile }) {
    
    const [viewedCards, setViewedCards] = useState({});
    const [loading, setLoading] = useState(false);
    const [docfile, setDocfile] = useState();
    // const user = useSelector(selectUser)
    // console.log(userprofile, "this is user profile data")
    const [formData, setFormData] = useState({
        licenseNumber: "",
        licenseExpiry: "",
        driverpic: "",
        companyname: "",
        plicenseNumber: "",
        professionalExpiry: "",
        professionalpic: "",
        coverletter: "",
        coverpic: "",
        other: "",
        otherpic: "",
        certificate: "",
        certificatepic: "",

    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

    };


    const handleEyeIconClick = (index) => {
        setViewedCards((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // mainform.append("number", formData?.licenseNumber);
    // mainform.append("expiry_date", formData?.licenseExpiry);
    // mainform.append("driver_file", formData?.driverpic);
    // mainform.append("company", formData?.companyname)
    // mainform.append("number", formData?.plicenseNumber)
    // mainform.append("expiry_date", formData?.professionalExpiry)

    // mainform.append("type", formData?.certificate)
    // mainform.append("certificate_file", formData?.certificatepic)
    // mainform.append("resume_file", formData?.coverpic);
    // mainform.append("cover_letter", formData?.coverletter);
    // mainform.append("other_file", formData?.otherpic)
    // mainform.append("detail", formData?.other)




    useEffect(() => {
        setFormData({
            licenseNumber: userprofile?.driver_license?.number,
            cnic: userprofile?.driver_license?.cnic,
            licenseExpiry: userprofile?.driver_license?.expiry_date,
            driverpic: userprofile?.driver_license?.file,
            companyname: userprofile?.professional_license?.company,
            plicenseNumber: userprofile?.professional_license?.number,
            professionalExpiry: userprofile?.professional_license?.expiry_date,
            personalpic: userprofile?.professional_license?.file,
            certificate: userprofile?.certification?.type,
            certificatepic: userprofile?.certification?.file,
            coverpic: userprofile?.resume?.file,
            coverletter: userprofile?.resume?.cover_letter,
            otherpic: userprofile?.other_documents?.file,
            other: userprofile?.other_documents?.detail

        })

    }, [])


    const updateresume = async () => {
        const newErrors = {};
        const excludeFields = [
            "other",
            "otherpic",
            "cnic",
            "licenseNumber",
            "licenseExpiry",
            "driverpic",
            "companyname",
            "plicenseNumber",
            "professionalExpiry",
            "professionalpic",
            // "coverletter",
            "certificatepic",
            "coverpic"
        ];
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !excludeFields.includes(field)) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        setErrors(newErrors);
        console.log(newErrors, "these are errors")
        if (Object.keys(newErrors).length === 0) {
            const mainform = new FormData();
            mainform.append("cover_letter", formData?.coverletter)
            if (docfile instanceof File) {
                console.log("certificate_file", docfile)
                mainform.append("file", docfile);
            }

            try {
                // setAuthToken();
                setLoading(true)
                const response = await apiClient.patch(`/professional/api/resume/${userprofile?.resume?.id}/`, mainform);
                console.log(response, "this is response data");
                if (response.ok) {
                    setLoading(false)
                    getUserdata();
                    setFormData({
                        ...formData,
                        coverletter: response?.data?.cover_letter,
                    })
                    setDocfile(response?.data?.file)
                    toast.success("Document updated successfully")
                    setIsEditingDocument(false)
                } else {
                    setLoading(false)
                    if (response.status === 400) {

                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value);
                        });
                    }


                }
            } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
            }

        }

    }
    const updatecertificate = async () => {
        const newErrors = {};
        const excludeFields = [
            "other",
            "otherpic",
            "cnic",
            "licenseNumber",
            "driverpic",
            "companyname",
            "plicenseNumber",
            "professionalExpiry",
            "professionalpic",
            "coverletter",
            "licenseExpiry",
            "certificatepic",
            // "certificate"
        ];
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !excludeFields.includes(field)) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        setErrors(newErrors);
        console.log(newErrors, "these are errors")
        if (Object.keys(newErrors).length === 0) {
            const mainform = new FormData();
            mainform.append("type", formData?.certificate)
            if (docfile instanceof File) {
                console.log("certificate_file", docfile)
                mainform.append("file", docfile);
            }

            try {
                // setAuthToken();
                setLoading(true)
                const response = await apiClient.patch(`/professional/api/certification/${userprofile?.certification?.id}/`, mainform);
                console.log(response, "this is response data");
                if (response.ok) {
                    setLoading(false)
                    setFormData({
                        ...formData,
                        certificate: response?.data?.type,
                    })
                    setDocfile(response?.data?.file)
                    getUserdata();
                    setIsEditingDocument(false)
                    toast.success("Document updated successfully")
                } else {
                    setLoading(false)
                    if (response.status === 400) {

                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value);
                        });
                    }


                }
            } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
            }

        }

    }
    const updateProfessionalData = async () => {
        const newErrors = {};
        const excludeFields = [
            "other",
            "otherpic",
            "cnic",
            "licenseNumber",
            "licenseExpiry",
            "driverpic",
            // "companyname",
            // "plicenseNumber",
            // "professionalExpiry",
            "professionalpic",
            "coverletter",
            "certificatepic",
            "certificate"
        ];
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !excludeFields.includes(field)) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const mainform = new FormData();
            mainform.append('company', formData?.companyname)
            mainform.append('number', formData?.plicenseNumber)
            mainform.append('expiry_date', formData?.professionalExpiry)
            if (docfile instanceof File) {
                mainform.append("file", docfile);
            }

            try {
                // setAuthToken();
                setLoading(true)
                const response = await apiClient.patch(`/professional/api/professional_license/${userprofile?.professional_license?.id}/`, mainform);
                console.log(response, "this is response data");
                if (response.ok) {
                    getUserdata();
                    setLoading(false)
                    setFormData({
                        ...formData,
                        companyname: response?.data?.company,
                        number: response?.data?.licenseNumber,
                        professionalExpiry: response?.data?.licenseExpiry,
                    })
                    setDocfile(response?.data?.file)
                    setIsEditingDocument(false)
                    toast.success("Document updated successfully")
                } else {
                    setLoading(false)
                    if (response.status === 400) {

                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value);
                        });
                    }


                }
            } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
            }

        }

    }



    const updateLicenseData = async () => {
        const newErrors = {};
        const excludeFields = [
            "other",
            "otherpic",
            "number",
            // "licenseNumber",
            // licenseExpiry
            "driverpic",
            "companyname",
            "plicenseNumber",
            "professionalExpiry",
            "professionalpic",
            "coverletter",
            "certificatepic",
            "certificate"
        ];
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !excludeFields.includes(field)) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        setErrors(newErrors);

        console.log(newErrors,"this is new error data",formData?.licenseNumber)

        if (Object.keys(newErrors).length === 0) {
            const mainform = new FormData();
            mainform.append('cnic', formData?.cnic)
            mainform.append('number', formData?.licenseNumber)
            mainform.append('expiry_date', formData?.licenseExpiry)

            if (docfile instanceof File) {
                mainform.append("file", docfile);
            }

            try {
                // setAuthToken();
                setLoading(true)
                const response = await apiClient.patch(`/professional/api/driver_license/${userprofile?.driver_license?.id}/`, mainform);
                console.log(response, "this is response data");
                if (response.ok) {
                    setLoading(false)
                    getUserdata();
                    setFormData({
                        ...formData,
                        cnic: response?.data?.cnic,
                        number: response?.data?.licenseNumber,
                        licenseExpiry: response?.data?.expiry_date,
                    })
                    setDocfile(response?.data?.file)
                    setIsEditingDocument(false)
                    toast.success("Document updated successfully")
                } else {
                    setLoading(false)
                    if (response.status === 400) {

                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value);
                        });
                    }


                }
            } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
            }

        }

    }
    const updateother = async () => {
        const newErrors = {};
        const excludeFields = [
            "other",
            "otherpic",
            "cnic",
            "licenseNumber",
            "licenseExpiry",
            "driverpic",
            "companyname",
            "plicenseNumber",
            "professionalExpiry",
            "professionalpic",
            "coverletter",
            "certificatepic",
            "certificate"
        ];
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !excludeFields.includes(field)) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        console.log(errors,"these are error")
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const mainform = new FormData();
            mainform.append('detail', formData?.other)
            if (docfile instanceof File) {
                mainform.append("file", docfile);
            }
            try {
                // setAuthToken();
                setLoading(true)
                const response = await apiClient.patch(`/professional/api/other_documents/${userprofile?.other_documents?.id}/`, mainform);
                console.log(response, "this is response data");
                if (response.ok) {
                    setLoading(false)
                    getUserdata();

                    setFormData({
                        ...formData,
                        cnic: response?.data?.cnic,
                        number: response?.data?.licenseNumber,
                        licenseExpiry: response?.data?.expiry_date,
                    })
                    setDocfile(response?.data?.file)
                    toast.success("Document updated successfully")
                    setIsEditingDocument(false)
                } else {
                    setLoading(false)
                    if (response.status === 400) {

                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value);
                        });
                    }


                }
            } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
            }

        }

    }


    const getUserdata = async () => {
        try { 
          setLoading(true);
          const response = await apiClient.get('/professional/api/professional/my_profile/');
          console.log(response, "this is roledata response");
          if (response.ok) {
            setUserprofile(response?.data)
            // setRole(response?.data?.results);
          }
          setLoading(false);
        } catch (error) {
          console.log(error, "this is error of response");
          setLoading(false);
        }
      }


    const handleUpload = (e) => {

        const file = e.target.files[0];
        setDocfile(file);

    };

    useEffect(() => {

        if (card.title === "Resume") {
            setDocfile(userprofile?.resume?.file)
        }
        else if (card.title === "Driver’s License") {
            setDocfile(userprofile?.driver_license?.file)
        }
        else if (card.title === "Professional License") {
            setDocfile(userprofile?.professional_license?.file)
        }
        else if (card.title === "Certifications") {
            setDocfile(userprofile?.certification?.file)
        } else {

            setDocfile(userprofile?.other_documents?.file)
        }

    }, [card])





    const handlesubmit = () => {
        if (card.title === "Resume") {
            updateresume();
        }
        else if (card.title === "Driver’s License") {
            updateLicenseData();
        }
        else if (card.title === "Professional License") {
            updateProfessionalData();
        }
        else if (card.title === "Certifications") {
            updatecertificate()
        } else {
            updateother();
        }


    }




    return (
        <div className="container-fluid  mt-4">
            <div className="w-100">
                <h3
                    style={{
                        fontFamily: 'Poppins',
                        fontSize: '20px',
                        fontWeight: '500',
                        lineHeight: '30px',
                        letterSpacing: '0.01em',
                        textAlign: 'left',
                        color: '#2F80ED',
                        marginBottom: '8px',
                    }}
                >
                    {card.title}
                </h3>
                <Form>
                    <Row>
                        <EditFile viewedCards={viewedCards} handleEyeIconClick={handleEyeIconClick} index={index} card={card} docfile={docfile} setDocfile={setDocfile} handleUpload={handleUpload} />

                        {card.title === "Resume" ? (
                            <Resume errors={errors} formData={formData} handleChange={handleChange} />
                        ) : card.title === "Certifications" ? (
                            <Certifications
                                errors={errors}
                                handleChange={handleChange}
                                formData={formData}
                            />
                        ) : card.title === "Driver’s License" ? (
                            <Driver errors={errors} handleChange={handleChange} formData={formData} />
                        ) : card.title === "Professional License" ? (
                            <Professional
                                errors={errors}
                                handleChange={handleChange}
                                formData={formData}
                            />
                        ) : (
                            <Other errors={errors} handleChange={handleChange} formData={formData} />
                        )}


                        <div className="d-flex justify-content-end  mb-5">
                            <Button
                                variant="primary"

                                style={{
                                    width: '155px',
                                    height: '45px',
                                    padding: '5px 10px',
                                    fontFamily: 'Poppins',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    letterSpacing: '0.05em',
                                    color: '#004fff',
                                    textAlign: 'center',
                                    backgroundColor: '#f7f7f7'
                                }}
                                onClick={() => {
                                setIsEditingDocument(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                style={{
                                    width: '155px',
                                    height: '45px',
                                    padding: '5px 10px',
                                    marginLeft: '20px',
                                    borderRadius: '5px 0px 0px 0px',
                                    opacity: '1',
                                    fontFamily: 'Poppins',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    letterSpacing: '0.05em',
                                    textAlign: 'center',
                                    color: '#004FFF',
                                    backgroundColor: '#004FFF1A',

                                }}
                                onClick={handlesubmit}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Row>
                </Form>
            </div>
            <Loader loading={loading} />
        </div>
    );
}

export default EditDocument;
