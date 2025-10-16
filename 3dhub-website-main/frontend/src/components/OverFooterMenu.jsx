import React, {Component} from 'react';

const OverFooterMenu = (props) => {
    return (
        <div className="over-footer-menu">

            {props.menu.map((element_menu, idx_menu) => (
                <div className='over-footer-subsubmenu' key={idx_menu}>
                    <a href="#" key={idx_menu} className="over-footer-submenu-title">{element_menu.submenu.title}</a>

                    {element_menu.submenu.subsubmenu.map((element_submenu, idx_submenu) => (
                        <div className='over-footer-subsubmenu' key={idx_submenu}>
                            <a href="#" className="over-footer-subsubmenu-title"
                               key={idx_submenu}>{element_submenu.title}</a>
                        </div>
                    ))}
                </div>))
            }
        </div>)
}

export default OverFooterMenu;