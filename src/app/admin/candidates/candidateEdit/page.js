'use client'

import Footer from "../../../../components/Footer"

export default function EditCandidatePage() {
  const documents = [
  {
    name: "Aadhaar_Front.jpg",
    img: "https://i.imgur.com/2DhmtJ4.png"
  },
  {
    name: "Aadhaar_Back.jpg",
    img: "https://i.imgur.com/Z8mY7QF.png"
  },
  {
    name: "PAN_Card.jpg",
    img: "https://i.imgur.com/4AiXzf8.jpeg"
  },
  {
    name: "ITI_Certificate.jpg",
    img: "https://i.imgur.com/6Iej2c3.jpeg"
  }
]
  return (
    <>
      {/* Header */}
      <div className="box-heading">

        <div className="box-title">
          <h3 className="mb-5">Edit Candidate Profile</h3>
          <p className="font-sm color-text-paragraph-2">
            User ID: CAND-98234-RS
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><a href="/admin/candidates">Candidates</a></li>
              <li><span>Edit - Alexander Wright</span></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="section-box mt-20">
        <div className="row">

          {/* Main Content */}
          <div className="col-xl-9 col-lg-8">

            {/* Profile Information */}
            <div className="panel-white mb-20">
              <div className="box-padding">
                <div className="d-flex justify-content-between align-items-center mb-20">
                  <h5 className="mb-0">Profile Information</h5>

                
                </div>

                <div className="row">
                  <div className="col-md-6 mb-20">
                    <label className="font-sm mb-10">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Rahul Sharma"
                    />
                  </div>

                  <div className="col-md-6 mb-20">
                    <label className="font-sm mb-10">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="+91 98765 43210"
                    />
                  </div>

                  <div className="col-12">
                    <label className="font-sm mb-10">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue="rahul.sharma@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="panel-white mb-20">
              <div className="box-padding">
                <h5 className="mb-20">Identity Verification</h5>

                <div className="row">
                  <div className="col-md-6 mb-20">
                    <label className="font-sm mb-10">National ID Type</label>
                    <select className="form-control">
                      <option>Aadhaar (India)</option>
                      <option>PAN Card</option>
                      <option>Passport</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-20">
                    <label className="font-sm mb-10">KYC Documents</label>

                    <div className="border rounded p-3 d-flex gap-3 align-items-center">
                      <img
                        src="https://pvccardwala.com/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-12-at-5.02.59-PM-1.jpeg"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "12px"
                        }}
                      />

                      <div>
                        <h6 className="mb-5">Aadhaar_Front.jpg</h6>
                        <p className="font-xs color-text-paragraph-2 mb-5">
                          Uploaded on Jan 12, 2024
                        </p>
                        <a href="#" className="font-sm color-brand-1">
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="font-sm mb-10">ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="XXXX-XXXX-1234"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="panel-white mb-20">
              <div className="box-padding">
                <h5 className="mb-20">Education & Certifications</h5>

                <div className="row">
                  <div className="col-md-4 mb-20">
                    <label className="font-sm mb-10">ITI Certificate</label>

                    <div className="border rounded p-2 text-center">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTjV_NKW48YeqkUxUYHNN3mhKX-YybptO9Tg&s"
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                          height: "320px",
                          objectFit: "cover"
                        }}
                      />

                      <span className="btn btn-tags-sm mt-10">
                        AI Verified
                      </span>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="row">

                      <div className="col-md-6 mb-20">
                        <label className="font-sm mb-10">Trade</label>
                        <input
                          className="form-control"
                          defaultValue="Electrician"
                        />
                        <span className="font-xs color-success">
                          AI Confidence: 98%
                        </span>
                      </div>

                      <div className="col-md-6 mb-20">
                        <label className="font-sm mb-10">Institute</label>
                        <input
                          className="form-control"
                          defaultValue="Govt ITI Delhi"
                        />
                      </div>

                      <div className="col-md-6 mb-20">
                        <label className="font-sm mb-10">Year of Passing</label>
                        <input
                          className="form-control"
                          defaultValue="2022"
                        />
                      </div>

                      <div className="col-md-6 mb-20">
                        <label className="font-sm mb-10">Certificate No.</label>
                        <input
                          className="form-control"
                          defaultValue="ITI-DL-2022-8871"
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status + Billing */}
            <div className="row">

            

              <div className="col-md-12">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <h5 className="mb-20">Billing & Payments</h5>

                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-5">Registration Fee</h6>
                          <p className="font-xs color-text-paragraph-2">
                            One-time payment
                          </p>
                        </div>

                        <div className="text-end">
                          <h6>₹100</h6>
                          <span className="btn btn-tags-sm">PAID</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-xs color-text-paragraph-2 mt-10">
                      Payment processed via Razorpay on Jan 10, 2024
                    </p>
                  </div>
                </div>
              </div>

            </div>

       

          </div>

          {/* Sidebar */}
          <div className="col-xl-3 col-lg-4">

            <div className="panel-white mb-20">
              <div className="box-padding">
                <h5 className="mb-20">Audit Log</h5>

                <ul className="list-unstyled">

                  <li className="mb-20">
                    <strong className="color-success">
                      CURRENT SESSION
                    </strong>
                    <p className="mb-5">Status changed to Approved</p>
                    <span className="font-xs color-text-paragraph-2">
                      By Adarsh Kumar • Just now
                    </span>
                  </li>

                  <li className="mb-20">
                    <strong>Email Address Updated</strong>
                    <p className="font-sm mb-5">
                      rahul.s@gmail.com → rahul.sharma@example.com
                    </p>
                    <span className="font-xs color-text-paragraph-2">
                      Yesterday, 10:15 AM
                    </span>
                  </li>

                  <li className="mb-20">
                    <strong>KYC Documents Verified</strong>
                    <p className="font-sm mb-5">
                      Aadhaar verified by AI Engine v2.4
                    </p>
                    <span className="font-xs color-text-paragraph-2">
                      Jan 12, 2024
                    </span>
                  </li>

                  <li>
                    <strong>Account Created</strong>
                    <p className="font-sm mb-5">
                      Jan 10, 2024 - 02:15 PM
                    </p>
                  </li>

                </ul>

                <a href="#" className="font-sm color-brand-1">
                  View Full History
                </a>
              </div>
            </div>

           

          </div>

        </div>
           <div className="section-box">
       
          <div className="section-box">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="d-flex align-items-center" style={{ gap: '20px', flexWrap: 'wrap' }}>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-default hover-up" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', height: '44px', borderRadius: '10px' }}>Approve</button>
              <button className="btn btn-default hover-up" style={{ background: '#fdecea', color: '#c62828', border: '1px solid #ef9a9a', height: '44px', borderRadius: '10px' }}>Reject</button>
              <button className="btn btn-default hover-up" style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80', height: '44px', borderRadius: '10px' }}>Flag</button>
              <a href="/recruiters" className="btn d-flex align-items-center justify-content-center" style={{ height: '44px', padding: '0 18px', borderRadius: '10px' }}>Discard Changes</a>
              <a href="#" className="btn btn-primary d-flex align-items-center justify-content-center" style={{ height: '44px', padding: '0 18px', borderRadius: '10px' }}>Save Changes</a>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      <Footer />
    </>
  )
}