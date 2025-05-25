
interface DisableLayerProp {
    disabled: boolean; 
}

export function DisableLayer ({disabled}: DisableLayerProp) {
    return ( 
        <div 
            style={{
                "display": (disabled? "block" : "none"), 
                "position": "absolute",
                "top": "-2",
                "left": "-2",
                "width": "100%",
                "height": "100%",
                "zIndex": "997",
                "cursor": "not-allowed",
                "opacity": "0.6",
            }}
        ></div>
    );
}

export default DisableLayer;
