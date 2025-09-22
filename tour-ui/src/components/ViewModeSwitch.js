import React from 'react';
import { Switch, Tooltip } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';

const ViewModeSwitch = ({ viewMode, onChange }) => {
    return (
        <Tooltip title={viewMode === 'card' ? 'Chế độ Card' : 'Chế độ List'}>
            <Switch
                checkedChildren={<AppstoreOutlined />}
                unCheckedChildren={<UnorderedListOutlined />}
                checked={viewMode === 'card'}
                onChange={(checked) => onChange(checked ? 'card' : 'list')}
            />
        </Tooltip>
    );
};

export default ViewModeSwitch;
