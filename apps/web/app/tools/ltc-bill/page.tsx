"use client";
import { useState } from "react";

interface LTCBillData {
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  ltcType: string;
  blockYear: string;
  journeyFrom: string;
  journeyTo: string;
  departureDate: string;
  returnDate: string;
  familyMembers: { name: string; age: number; relation: string }[];
  fareDetails: {
    mode: string;
    class: string;
    ticketNo: string;
    amount: number;
  }[];
}

export default function LTCBillGenerator() {
  const [formData, setFormData] = useState<LTCBillData>({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    ltcType: "Home Town",
    blockYear: "2023-2024",
    journeyFrom: "",
    journeyTo: "",
    departureDate: "",
    returnDate: "",
    familyMembers: [{ name: "", age: 0, relation: "Spouse" }],
    fareDetails: [{ mode: "Train", class: "AC 3-Tier", ticketNo: "", amount: 0 }],
  });

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: "", age: 0, relation: "Child" }],
    });
  };

  const removeFamilyMember = (index: number) => {
    setFormData({
      ...formData,
      familyMembers: formData.familyMembers.filter((_, i) => i !== index),
    });
  };

  const addFareDetail = () => {
    setFormData({
      ...formData,
      fareDetails: [...formData.fareDetails, { mode: "Train", class: "AC 3-Tier", ticketNo: "", amount: 0 }],
    });
  };

  const removeFareDetail = (index: number) => {
    setFormData({
      ...formData,
      fareDetails: formData.fareDetails.filter((_, i) => i !== index),
    });
  };

  const totalAmount = formData.fareDetails.reduce((sum, fare) => sum + (Number(fare.amount) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">LTC Bill Generator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Name</label>
            <input
              type="text"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter employee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter employee ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter designation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter department"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">LTC Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">LTC Type</label>
            <select
              value={formData.ltcType}
              onChange={(e) => setFormData({ ...formData, ltcType: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="Home Town">Home Town</option>
              <option value="All India">All India</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Block Year</label>
            <input
              type="text"
              value={formData.blockYear}
              onChange={(e) => setFormData({ ...formData, blockYear: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., 2023-2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Journey From</label>
            <input
              type="text"
              value={formData.journeyFrom}
              onChange={(e) => setFormData({ ...formData, journeyFrom: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter departure city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Journey To</label>
            <input
              type="text"
              value={formData.journeyTo}
              onChange={(e) => setFormData({ ...formData, journeyTo: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter destination city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure Date</label>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Return Date</label>
            <input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Family Members</h2>
        {formData.familyMembers.map((member, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-2">
            <input
              type="text"
              value={member.name}
              onChange={(e) => {
                const updated = [...formData.familyMembers];
                updated[index].name = e.target.value;
                setFormData({ ...formData, familyMembers: updated });
              }}
              className="p-2 border rounded"
              placeholder="Name"
            />
            <input
              type="number"
              value={member.age}
              onChange={(e) => {
                const updated = [...formData.familyMembers];
                updated[index].age = parseInt(e.target.value) || 0;
                setFormData({ ...formData, familyMembers: updated });
              }}
              className="p-2 border rounded"
              placeholder="Age"
            />
            <select
              value={member.relation}
              onChange={(e) => {
                const updated = [...formData.familyMembers];
                updated[index].relation = e.target.value;
                setFormData({ ...formData, familyMembers: updated });
              }}
              className="p-2 border rounded"
            >
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Dependent">Dependent</option>
            </select>
            <button
              onClick={() => removeFamilyMember(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFamilyMember}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
        >
          Add Family Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Fare Details</h2>
        {formData.fareDetails.map((fare, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-2">
            <select
              value={fare.mode}
              onChange={(e) => {
                const updated = [...formData.fareDetails];
                updated[index].mode = e.target.value;
                setFormData({ ...formData, fareDetails: updated });
              }}
              className="p-2 border rounded"
            >
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
              <option value="Bus">Bus</option>
              <option value="Taxi">Taxi</option>
            </select>
            <input
              type="text"
              value={fare.class}
              onChange={(e) => {
                const updated = [...formData.fareDetails];
                updated[index].class = e.target.value;
                setFormData({ ...formData, fareDetails: updated });
              }}
              className="p-2 border rounded"
              placeholder="Class/Type"
            />
            <input
              type="text"
              value={fare.ticketNo}
              onChange={(e) => {
                const updated = [...formData.fareDetails];
                updated[index].ticketNo = e.target.value;
                setFormData({ ...formData, fareDetails: updated });
              }}
              className="p-2 border rounded"
              placeholder="Ticket No"
            />
            <input
              type="number"
              value={fare.amount}
              onChange={(e) => {
                const updated = [...formData.fareDetails];
                updated[index].amount = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, fareDetails: updated });
              }}
              className="p-2 border rounded"
              placeholder="Amount"
            />
            <button
              onClick={() => removeFareDetail(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFareDetail}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
        >
          Add Fare Detail
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-xl font-semibold">Total Claim Amount: ₹{totalAmount.toFixed(2)}</div>
      </div>

      <button
        onClick={handlePrint}
        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 font-semibold"
      >
        Generate & Print LTC Bill
      </button>

      {/* Print Preview */}
      <div id="print-area" className="hidden print:block">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">LTC BILL</h1>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">EMPLOYEE DETAILS</h2>
            <table className="w-full border-collapse border">
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Name</td>
                  <td className="border p-2">{formData.employeeName}</td>
                  <td className="border p-2 font-medium">Employee ID</td>
                  <td className="border p-2">{formData.employeeId}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Designation</td>
                  <td className="border p-2">{formData.designation}</td>
                  <td className="border p-2 font-medium">Department</td>
                  <td className="border p-2">{formData.department}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">LTC DETAILS</h2>
            <table className="w-full border-collapse border">
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">LTC Type</td>
                  <td className="border p-2">{formData.ltcType}</td>
                  <td className="border p-2 font-medium">Block Year</td>
                  <td className="border p-2">{formData.blockYear}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Journey From</td>
                  <td className="border p-2">{formData.journeyFrom}</td>
                  <td className="border p-2 font-medium">Journey To</td>
                  <td className="border p-2">{formData.journeyTo}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Departure Date</td>
                  <td className="border p-2">{formData.departureDate}</td>
                  <td className="border p-2 font-medium">Return Date</td>
                  <td className="border p-2">{formData.returnDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">FAMILY MEMBERS TRAVELLING</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Age</th>
                  <th className="border p-2">Relation</th>
                </tr>
              </thead>
              <tbody>
                {formData.familyMembers.filter(m => m.name).map((member, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{member.name}</td>
                    <td className="border p-2 text-center">{member.age}</td>
                    <td className="border p-2">{member.relation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">FARE DETAILS</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Mode</th>
                  <th className="border p-2">Class</th>
                  <th className="border p-2">Ticket No</th>
                  <th className="border p-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {formData.fareDetails.map((fare, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{fare.mode}</td>
                    <td className="border p-2">{fare.class}</td>
                    <td className="border p-2">{fare.ticketNo}</td>
                    <td className="border p-2 text-right">{fare.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="border p-2 font-semibold text-right">TOTAL</td>
                  <td className="border p-2 font-semibold text-right">₹{totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <div className="flex justify-between">
              <div>
                <p>Date: ________________</p>
              </div>
              <div className="text-center">
                <p>_______________________</p>
                <p>Employee Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}