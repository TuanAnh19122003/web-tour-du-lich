import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;
const API_URL = `${process.env.REACT_APP_API_URL}/address`;

const AddressModal = ({ visible, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    // Fetch data helper
    const fetchData = async (url, setter) => {
        try {
            const res = await axios.get(url);
            setter(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Load provinces khi modal mở
    useEffect(() => {
        if (visible) fetchData(`${API_URL}/provinces`, setProvinces);
    }, [visible]);

    // Load districts khi province thay đổi
    useEffect(() => {
        if (selectedProvince) {
            fetchData(`${API_URL}/districts/${selectedProvince.code}`, setDistricts);
        } else {
            setDistricts([]);
        }
        setSelectedDistrict(null);
        setSelectedWard(null);
    }, [selectedProvince]);

    // Load wards khi district thay đổi
    useEffect(() => {
        if (selectedDistrict) {
            fetchData(`${API_URL}/wards/${selectedDistrict.code}`, setWards);
        } else {
            setWards([]);
        }
        setSelectedWard(null);
    }, [selectedDistrict]);

    const handleConfirm = () => {
        const fullAddress = [street, selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
            .filter(Boolean)
            .join(', ');
        onConfirm(fullAddress);
        onClose();
    };

    const renderSelect = (placeholder, options, selected, onChange) => (
        <Select
            placeholder={placeholder}
            value={selected?.code || undefined}
            onChange={code => onChange(options.find(item => item.code === code))}
            allowClear
        >
            {options.map(item => (
                <Option key={item.code} value={item.code}>
                    {item.name}
                </Option>
            ))}
        </Select>
    );

    return (
        <Modal
            title="Chọn địa chỉ giao hàng"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Hủy</Button>,
                <Button key="confirm" type="primary" onClick={handleConfirm}>Xác nhận</Button>,
            ]}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input
                    placeholder="Số nhà / Đường"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                />
                {renderSelect('Chọn tỉnh/thành phố', provinces, selectedProvince, setSelectedProvince)}
                {renderSelect('Chọn quận/huyện', districts, selectedDistrict, setSelectedDistrict)}
                {renderSelect('Chọn phường/xã', wards, selectedWard, setSelectedWard)}
            </div>
        </Modal>
    );
};

export default AddressModal;
