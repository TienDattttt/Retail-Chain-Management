import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PlusCircle } from "react-feather";

const Breadcrumbs = (props) => {
  let addButton = null;
  // Simplified breadcrumbs - chỉ hiển thị title và nút add
  addButton = (
    <div className="page-header">
      <div className="add-item d-flex">
        <div className="page-title">
          <h4>{props.maintitle}</h4>
          <h6>{props.subtitle}</h6>
        </div>
      </div>
      {props.addButton && (
        <div className="page-btn">
          <Link
            to="#"
            className="btn btn-added"
            onClick={(e) => {
              e.preventDefault();
              if (props.onAddClick) {
                props.onAddClick();
              }
            }}
            data-bs-toggle={!props.onAddClick ? "modal" : ""}
            data-bs-target={!props.onAddClick ? "#add-units" : ""}
          >
            <PlusCircle className="me-2" />
            {props.addButton}
          </Link>
        </div>
      )}
    </div>
  );

  return <>{addButton}</>;
};

Breadcrumbs.propTypes = {
  maintitle: PropTypes.string,
  subtitle: PropTypes.string,
  addButton: PropTypes.string,
  importbutton: PropTypes.string,
  onAddClick: PropTypes.func,
};

export default Breadcrumbs;
