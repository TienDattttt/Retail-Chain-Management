import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

const AddCategoryList = ({ show, onHide, onSubmit }) => {
    console.log('AddCategoryList rendered with show:', show);
    
    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="lg" 
            centered
            style={{ zIndex: 9999 }}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Tạo danh mục mới</Modal.Title>
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
                        Tạo danh mục
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

AddCategoryList.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
};

export default AddCategoryList
