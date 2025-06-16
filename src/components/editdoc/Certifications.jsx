import { Alert, Box } from '@mui/material'
import React from 'react'

const Certifications = ({ handleChange, errors, formData }) => {
    return (

        <Box className="col-lg-8 col-md-7">
            <Box className="row">
                {/* Select Certificate Field */}
                <Box className="col-lg-6 mt-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block", color: "#909090" }}>
                        Select Certificate *</label>
                    <input type="text"
                        className="form-control"
                        name="certificate"
                        onChange={handleChange}
                        value={formData?.certificate}
                        required style={{

                            backgroundColor: "#ffffff",
                            border: "none",
                            height: "45px",
                            outline: "none",
                        }}>
                        
                    </input>
                    {errors?.certificate && <Alert severity="error" className="mt-2">Certificate is required</Alert>}
                </Box>
            </Box>
        </Box>

    )
}

export default Certifications;