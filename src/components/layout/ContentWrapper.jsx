import React from 'react'

const ContentWrapper = () => {
    return (
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
export default ContentWrapper