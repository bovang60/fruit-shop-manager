import React, { useState } from 'react';
import SystemSettingsView from './SystemSettingsView';

const SystemSettings: React.FC = () => {
    const [deliveryZones, setDeliveryZones] = useState<string[]>(['Zone 1 - Urban', 'Zone 2 - Suburban']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleClose = (removedTag: string) => {
        const newTags = deliveryZones.filter(tag => tag !== removedTag);
        setDeliveryZones(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && deliveryZones.indexOf(inputValue) === -1) {
            setDeliveryZones([...deliveryZones, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    return (
        <SystemSettingsView
            deliveryZones={deliveryZones}
            handleClose={handleClose}
            showInput={showInput}
            handleInputChange={handleInputChange}
            handleInputConfirm={handleInputConfirm}
            inputVisible={inputVisible}
            inputValue={inputValue}
        />
    );
};

export default SystemSettings;
