import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      
      <section className="mb-4">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>Welcome to Suyapmedi. Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our patient booking system.</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li><strong>Personal Information:</strong> Name, age, gender, and address.</li>
          <li><strong>Medical Records:</strong> Any health-related information, prescriptions, and invoices.</li>
          <li><strong>Booking Details:</strong> Selected doctor, appointment date and time, and cancellation details.</li>
          <li><strong>User Reviews:</strong> Feedback and ratings for doctors.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To facilitate doctor appointments and maintain patient records.</li>
          <li>To provide invoices and prescriptions.</li>
          <li>To improve our services based on user feedback.</li>
          <li>To notify users of appointment confirmations, cancellations, or updates.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">4. Data Sharing and Security</h2>
        <p>We do not sell or share your personal information with third parties except as required for service fulfillment (e.g., doctors, medical institutions).</p>
        <p>Your medical records and personal details are stored securely with encryption.</p>
        <p>We take necessary measures to prevent unauthorized access, disclosure, or modification of your data.</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">5. User Rights</h2>
        <ul className="list-disc pl-6">
          <li>You can update or delete your personal information by accessing your account settings.</li>
          <li>You can request the deletion of your medical records, subject to legal retention requirements.</li>
          <li>You have the right to withdraw consent for data collection at any time, though this may impact service availability.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">6. Appointment Booking and Cancellation</h2>
        <p>Users can book appointments by selecting the doctor, date, and time.</p>
        <p>Appointments can be canceled as per the cancellation policy stated in the app.</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">7. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be communicated via email or an in-app notification.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p>For any questions or concerns regarding this Privacy Policy, please contact us.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
