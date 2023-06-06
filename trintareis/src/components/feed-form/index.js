import './feedForm.css';
import React from 'react';

export default function (props) {
    return (
        <div className="feed">
            <div className="feedForm">
                <div className="div__header">
                    <div className="div__foto">
                        <div>
                            <img src={props.profilePhoto} />
                        </div>
                    </div>
                    <div className="div__button">
                        <div style={{ textDecoration: 'none' }}>
                            <div className="feedForm_span">
                                <span>Nova publicação</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}