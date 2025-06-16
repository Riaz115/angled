import { Alert, Box } from '@mui/material'
import React from 'react'
const Resume = ({handleChange,errors,formData}) => {
    return (
        
            <Box className="col-lg-8 col-md-7 d-flex align-items-center justify-content-center">
                <Box style={{ width: "100%", marginBottom: "20%" }}>
                    <Box className="text-center">
                        <label style={{ fontWeight: 600, marginBottom: "5px", display: "block", color: "#909090", textAlign: 'start' }}>

                            Cover Letter <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                            type="text"
                            // aria-rowcount={8}
                            name="coverletter"
                            rows={10} 
                            onChange={handleChange}
                            value={formData?.coverletter}
                            className="form-control"
                            required
                            style={{
                                backgroundColor: "#ffffff",
                                border: "none",
                                height: "75px",
                                // outline: "none",
                                textAlign: "start",
                            }}
                        />
                        {errors.coverletter && <Alert severity="error" className="mt-2">Cover Letter is required</Alert>}
                    </Box>
                </Box>
            </Box>
        
    )
}

export default Resume