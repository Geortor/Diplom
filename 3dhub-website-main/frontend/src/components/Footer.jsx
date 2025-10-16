import React, {Component} from 'react';
import OverFooterMenu from "./OverFooterMenu";
import UnderFooterMenu from "./UnderFooterMenu";

const Footer = (props) => {
    if (props.over_footer_menu && props.under_footer_menu && props.width > 771) {
        return (
        <footer>
            <div className="footer-container">
                <OverFooterMenu menu={props.over_footer_menu}/>
                <UnderFooterMenu menu={props.under_footer_menu}/>
            </div>
        </footer>
    );
    }
}

export default Footer;