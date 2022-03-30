import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { withRouter } from "react-router";
import { useLocation } from 'react-router-dom';
import { FaQuestionCircle, FaCheck } from "react-icons/fa";
import { IoBookmarks, IoStatsChart, IoList } from "react-icons/io5";
import { IconButton } from '@material-ui/core';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import '../assets/style.scss'
import { useState } from 'react';


const SideBar = () => {
    // let location = useLocation().pathname;
    const [show, setShow] = useState(true);
    const Toggle = () => setShow(!show);
    return (
        <>
            <ProSidebar width="240px !default" collapsed={show} style={{ position: "fixed", top: "72px" }}>
                <SidebarHeader>
                    <div
                        style={show ? {
                            padding: '24px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: 14,
                            letterSpacing: '1px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        } :
                            {
                                padding: '24px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                fontSize: 14,
                                letterSpacing: '1px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }
                        }
                    >
                        ABC
                        {show ?
                            <IconButton onClick={() => Toggle()}><KeyboardDoubleArrowRightIcon /></IconButton>
                            :
                            <IconButton onClick={() => Toggle()}><KeyboardDoubleArrowLeftIcon /></IconButton>
                        }                    </div>
                </SidebarHeader>
                <Menu iconShape="circle">
                    <MenuItem icon={<IoBookmarks />}>My Class</MenuItem>
                    {/* <SubMenu title="Components" icon={<FaHeart />}>
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                    </SubMenu> */}
                    <MenuItem icon={<IoList />}>To Do List</MenuItem>
                    <MenuItem icon={<FaCheck />}>Attendance</MenuItem>
                    <MenuItem icon={<FaQuestionCircle />}>Q&A</MenuItem>
                    <MenuItem icon={<IoStatsChart />}>Summary</MenuItem>
                </Menu>
            </ProSidebar>
        </>
    );
}

export default withRouter(SideBar)