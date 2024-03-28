import React, { useState, useEffect } from "react";
import "./CreateQRCodeForm.css";
import { QRCode } from 'react-qrcode-logo';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { auth } from '../../firebase'; // Adjust the path accordingly
import imageUrl from '../Login/kcalogo.jpeg'

const CreateQRCodeForm = () => {
  const [unitName, setUnitName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showForm, setShowForm] = useState(true); // State to toggle between form and QR code display

  const getCurrentUserId = () => {
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid);
    } else {
      console.error('No user signed in');
    }
  };

  const generateQRCode = () => {
    const formattedDate = new Date(date);
    formattedDate.setHours(time ? time.hours() : 0, time ? time.minutes() : 0, 0, 0);

    const url = "https://example.com";
    const link = `${url}/${unitName}/${venue}/${formattedDate}/${currentUserId}`;

    setQrCodeData(link);
    setShowForm(false); // Set showForm to false to hide the form and show the QR code
  };

  const downloadCode = () => {
    const canvas = document.getElementById('your_QRCode_component_id');

    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // const allowAllDates = current => current;

  useEffect(() => {
    getCurrentUserId();
  }, []);

  return (
    <div className="create-qrcode-form-container">
      {showForm ? (
        // Render the form if showForm is true
        <>
          <h2>Create QR Code</h2>
          <form onSubmit={(e) => { e.preventDefault(); generateQRCode(); }}>
        <label>
          Unit Name:
          <input type="text" name="unitname" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
        </label>
        <br />
        <label>
          Venue:
          <input type="text" name="venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </label>
        <br />
        <label>
          Date:
          <DatePicker 
            selected={date} 
            onChange={(newDate) => setDate(newDate)} 
            filterDate={(current) => {
              // Disable dates that are before the current date
              return current >= new Date();
            }}
          />
        </label>
        <br />
        <label>
          Time:
          <TimePicker 
            showSecond={false} 
            defaultValue={time} 
            onChange={(newTime) => setTime(newTime)} 
            format="h:mm a" 
            use12Hours 
          />
        </label>
        <br />
        <button type="submit">Generate QR Code</button>
      </form>
        </>
      ) : (
        // Render the QR code if showForm is false
        <div>
          <QRCode
            value={qrCodeData}
            size={250}
            logoImage={imageUrl} // Replace with the actual URL of the logo
            logoHeight={40}
            logoWidth={40}
            logoOpacity={1}
            enableCORS={true}
            qrStyle="dots"
            eyeRadius={10}
            id="your_QRCode_component_id"
          />
          <button onClick={downloadCode}>Download Code</button>
        </div>
      )}
    </div>
  );
};

export default CreateQRCodeForm;
