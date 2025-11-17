import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, Sliders } from 'react-feather';
import ImageWithBasePath from '../img/imagewithbasebath';
import PropTypes from 'prop-types';

const FilterSection = ({ 
  isFilterVisible, 
  toggleFilterVisibility, 
  sortComponent, 
  children 
}) => {
  return (
    <>
      <div className="search-path">
        <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
          <Filter
            className="filter-icon"
            onClick={toggleFilterVisibility}
          />
          <span onClick={toggleFilterVisibility}>
            <ImageWithBasePath src="assets/img/icons/closes.svg" alt="img" />
          </span>
        </Link>
      </div>
      
      {sortComponent && (
        <div className="form-sort">
          <Sliders className="info-img" />
          {sortComponent}
        </div>
      )}
      
      {/* Filter Panel */}
      {children && (
        <div
          className={`card${isFilterVisible ? " visible" : ""}`}
          id="filter_inputs"
          style={{ display: isFilterVisible ? "block" : "none" }}
        >
          <div className="card-body pb-0">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

FilterSection.propTypes = {
  isFilterVisible: PropTypes.bool.isRequired,
  toggleFilterVisibility: PropTypes.func.isRequired,
  sortComponent: PropTypes.node,
  children: PropTypes.node,
};

export default FilterSection;