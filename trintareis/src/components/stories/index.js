import React from "react";
import minios_bg from '../../resources/minios.jpg';

function Stories() {
    return (
        <div className="stories">
            <div className="storiesCard__1" style={{ backgroundImage: `url(${minios_bg})` }}>
                <p>Trinta Reis</p>
            </div>
            <div className="storiesCard__2" style={{ backgroundImage: `url(${minios_bg})` }}>
                <p>Trinta Reis</p>
            </div>
            <div className="storiesCard__3" style={{ backgroundImage: `url(${minios_bg})` }}>
                <p>Trinta Reis</p>
            </div>
            {/* <div className="storiesCard" style={{ backgroundImage: `url(${minios_bg})` }}>
                <p>Trinta Reis</p>
            </div>
            <div className="storiesCard" style={{ backgroundImage: `url(${minios_bg})` }}>
                <p>Trinta Reis</p>
            </div> */}
        </div>
    )

}

export default Stories;