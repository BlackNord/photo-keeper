import React, { useState, useEffect } from 'react'

import { imageService, alertService } from '@/_services';

import { Image, init } from './Image'

function ImageList() {
    const [imageList, setImageList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null)

    useEffect(() => {
        refreshImageList();
    }, [])

    function refreshImageList() {
        imageService.getAll()
            .then(res => {
                setImageList(res)
            })
            .catch(error => {
                alertService.error(error);
            })
    }

    const addEdit = (formData, onSuccess) => {
        if (formData.get('id') == "0")
            imageService.create(formData)
                .then(res => {
                    onSuccess();
                    refreshImageList();
                })
                .catch(error => {
                    alertService.error(error);
                })
        else
            imageService.update(formData.get('id'), formData)
                .then(res => {
                    onSuccess();
                    refreshImageList();
                })
                .catch(error => {
                    alertService.error(error);
                })
    }

    const showRecordDetails = data => {
        setRecordForEdit(data)
    }

    const onDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure to delete this image?'))
            imageService.delete(id)
                .then(res => refreshImageList())
                .catch(error => {
                    alertService.error(error);
                })
        showRecordDetails(init);
    }

    const imageCard = data => (
        <div className="card" onClick={() => { showRecordDetails(data) }}>
            <img src={data.imageSrc} className="card-img-top" />
            <div className="card-body">
                <h6>{data.photoName}</h6>
                <span className="description">{data.description}</span>
                <button className="btn btn-light delete-button" onClick={e => onDelete(e, parseInt(data.id))}>
                    <i className="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    )

    // to handle up-button changing
    {
        var upButton = document.getElementById("up-button");
        window.addEventListener('scroll', function () {
            if (upButton && pageYOffset) {
                upButton.hidden = (pageYOffset < 50);
            }
        });
    }

    function goUp() {
        window.scrollTo(pageXOffset, 0);
        upButton.hidden = true;
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <Image
                    addEdit={addEdit}
                    recordForEdit={recordForEdit}
                />
            </div>
            <div className="col-md-8">
                <div>
                    <table className="without-borders">
                        <tbody>
                            {
                                [...Array(Math.ceil(imageList.length / 3))].map((e, i) =>
                                    <tr key={i}>
                                        <td className="without-borders">{imageCard(imageList[3 * i])}</td>
                                        <td className="without-borders">{imageList[3 * i + 1] ? imageCard(imageList[3 * i + 1]) : null}</td>
                                        <td className="without-borders">{imageList[3 * i + 2] ? imageCard(imageList[3 * i + 2]) : null}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <button className="up-button" id="up-button" hidden={true} onClick={() => goUp()}>Up</button>
            </div>
        </div>
    )
}

export { ImageList }
