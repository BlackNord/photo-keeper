import React, { useState, useEffect } from 'react'

import { accountService, alertService, colorizationService } from '@/_services';

const defaultImageSrc = '../public/img/image_placeholder.png'

export const init = {
    id: 0,
    photoName: '',
    description: '',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null,
    userId: 0
}

function Image(props) {
    const { addEdit, recordForEdit } = props

    const [values, setValues] = useState(init)
    const [errors, setErrors] = useState({})
    const user = accountService.userValue;
    const isAddMode = values.id == "0";

    useEffect(() => {
        if (recordForEdit != null)
            setValues(recordForEdit);
    }, [recordForEdit])

    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }

    const validate = () => {
        let temp = {}
        temp.photoName = values.photoName == "" ? false : true;
        temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
        setErrors(temp)

        return Object.values(temp).every(x => x == true)
    }

    const resetForm = () => {
        setValues(init)
        document.getElementById('image-uploader').value = null
        setErrors({})
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const formData = new FormData()
            formData.append('id', values.id)
            formData.append('photoName', values.photoName ? values.photoName : '')
            formData.append('description', values.description ? values.description : '')
            formData.append('imageName', isAddMode ? values.imageFile.name : values.imageName)
            formData.append('imageFile', values.imageFile)
            formData.append('userId', user.id)
            addEdit(formData, resetForm)
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '')

    // to handle input type changings
    {
        let fields = document.querySelectorAll('.form-control-file');
        Array.prototype.forEach.call(fields, function (input) {
            let label = input.nextElementSibling,
                labelVal = label.querySelector('.field__file-fake').innerText;

            input.addEventListener('change', function (e) {
                let countFiles = '';
                if (this.files && this.files.length >= 1)
                    countFiles = this.files.length;

                if (countFiles)
                    label.querySelector('.field__file-fake').innerText = 'Chosen files: ' + countFiles;
                else
                    label.querySelector('.field__file-fake').innerText = 'File isn\'t choosen';
            });
        });
    }

    const colorize = () => {
        colorizationService.colorize(values.id)
            .then(res => {
                window.location.reload();  
            })
            .catch(error => {
                alertService.error(error);
            })
    }

    return (
        <>
            <table className="without-borders">
                <tbody>
                    <tr>
                        <td className="without-borders">
                            <label className="lead">{isAddMode ? "Set new image here" : "Update image here"}</label>
                        </td>
                        <td className="without-borders">
                            {isAddMode ? <p></p> : <button className="btn btn-dark add-button" onClick={handleFormSubmit}>Add new</button>}
                        </td>
                        <td className="without-borders">
                            {isAddMode ? <p></p> : <button className="btn btn-dark colorize-button" onClick={() => colorize()}>Colorise</button>}
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} className="card-img-top" />
                    <div className="card-body">
                        <div className="form-group">
                            <div>
                                <input type="file" accept="image/*" id="image-uploader" onChange={showPreview} className={"form-control-file" + applyErrorClass('imageSrc')} />
                                <label className="field__file-wrapper" htmlFor="image-uploader">
                                    <div className="field__file-fake">File isn't choosen</div>
                                    <div className="field__file-button">Choose</div>
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applyErrorClass('photoName')} placeholder="Photo Name" name="photoName"
                                value={values.photoName}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applyErrorClass('description')} placeholder="Description" name="description"
                                value={values.description}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export { Image }
