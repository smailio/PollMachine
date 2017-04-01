import * as React from "react";

const SearchForm = ({text, handle_search_text_change}) => (
    <div className="row">
        <div className="col">
            <div className="form-check">
                <label className="form-check-label" style={{width : "100%"}}>
                    <input
                        value={text}
                        onChange={(e) => handle_search_text_change(e.target.value)}
                        style={{
                            width : "100%",
                            boxShadow: "none",
                            background: "transparent",
                            border: "none",
                            borderBottom : "1px solid black"
                        }}
                        placeholder="search"
                        className="form-check-input"
                        type="text"/>
                </label>
            </div>
        </div>
    </div>
);

export default SearchForm;