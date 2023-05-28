// assets
import { ChromeOutlined, QuestionOutlined, SkinOutlined, FormOutlined } from '@ant-design/icons';

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    FormOutlined,
    SkinOutlined
};

const purchases = {
    id: 'purchases',
    title: 'Purchases',
    type: 'group',
    children: [
        {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            url: '/reports',
            icon: icons.ChromeOutlined
        }
    ]
};

export default purchases;
