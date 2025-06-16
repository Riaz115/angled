import { Alert, Box } from '@mui/material'
import React from 'react'

const Other = ({ handleChange, errors, formData }) => {
    return (

        <Box className="col-lg-8 col-md-7 d-flex align-items-center justify-content-center">
            <Box style={{ width: "100%", marginBottom: "20%" }}>
                <Box className="text-center">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block", color: "#909090", textAlign: 'start' }}>
                        Enter Details of other Documents
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        name="other"
                        value={formData?.other}
                        onChange={handleChange}
                        rows={10}
                        required
                        style={{
                            backgroundColor: "#ffffff",
                            border: "none",
                            height: "75px",
                            outline: "none",
                            textAlign: "start",
                        }}
                    />
                    {errors.other && <Alert severity="error" className="mt-2">{errors.other}</Alert>}
                </Box>
            </Box>
        </Box>

    )
}

export default Other;