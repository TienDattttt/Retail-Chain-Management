import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

const EditCategoryList = ({ show, onHide, category, onSubmit }) => {
    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                categoryName: category.categoryName || '',
                description: category.description || ''
            });
        }
    }, [category]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit && category) {
            onSubmit({
                id: category.id,
                ...formData
            });
        }
    };


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa danh mục</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên danh mục *</Form.Label>
                        <Form.Control
                            type="text"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            placeholder="Nhập tên danh mục"
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả danh mục"
                        />
                    </Form.Group>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit">
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

EditCategoryList.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    category: PropTypes.shape({
        id: PropTypes.number,
        categoryName: PropTypes.string,
        description: PropTypes.string
    })
};

export default EditCategoryList
