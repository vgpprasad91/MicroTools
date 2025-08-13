"use client";
import { useState } from "react";

interface TADAEntry {
  date: string;
  fromPlace: string;
  toPlace: string;
  modeOfTravel: string;
  distance: number;
  fareAmount: number;
  daAmount: number;
  lodgingAmount: number;
  otherExpenses: number;
  remarks: string;
}

export default function TADABillGenerator() {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    employeeId: "",
    designation: "",
    department: "",
    purpose: "",
    periodFrom: "",
    periodTo: "",
    advanceTaken: 0,
  });

  const [entries, setEntries] = useState<TADAEntry[]>([{
    date: "",
    fromPlace: "",
    toPlace: "",
    modeOfTravel: "Bus",
    distance: 0,
    fareAmount: 0,
    daAmount: 0,
    lodgingAmount: 0,
    otherExpenses: 0,
    remarks: "",
  }]);

  const daRates = {
    "Metro": 600,
    "Class-A": 450,
    "Class-B": 300,
    "Class-C": 200,
  };

  const [cityClass, setCityClass] = useState<keyof typeof daRates>("Class-A");

  const addEntry = () => {
    setEntries([...entries, {
      date: "",
      fromPlace: "",
      toPlace: "",
      modeOfTravel: "Bus",
      distance: 0,
      fareAmount: 0,
      daAmount: 0,
      lodgingAmount: 0,
      otherExpenses: 0,
      remarks: "",
    }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof TADAEntry, value: any) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  const calculateDA = (index: number) => {
    const daAmount = daRates[cityClass];
    updateEntry(index, "daAmount", daAmount);
  };

  const totalFare = entries.reduce((sum, entry) => sum + (Number(entry.fareAmount) || 0), 0);
  const totalDA = entries.reduce((sum, entry) => sum + (Number(entry.daAmount) || 0), 0);
  const totalLodging = entries.reduce((sum, entry) => sum + (Number(entry.lodgingAmount) || 0), 0);
  const totalOther = entries.reduce((sum, entry) => sum + (Number(entry.otherExpenses) || 0), 0);
  const grandTotal = totalFare + totalDA + totalLodging + totalOther;
  const netPayable = grandTotal - (Number(employeeDetails.advanceTaken) || 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TA/DA Bill Generator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Name</label>
            <input
              type="text"
              value={employeeDetails.name}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input
              type="text"
              value={employeeDetails.employeeId}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, employeeId: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input
              type="text"
              value={employeeDetails.designation}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, designation: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              value={employeeDetails.department}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, department: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Purpose of Journey</label>
            <input
              type="text"
              value={employeeDetails.purpose}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, purpose: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period From</label>
            <input
              type="date"
              value={employeeDetails.periodFrom}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, periodFrom: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period To</label>
            <input
              type="date"
              value={employeeDetails.periodTo}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, periodTo: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City Class (for DA calculation)</label>
            <select
              value={cityClass}
              onChange={(e) => setCityClass(e.target.value as keyof typeof daRates)}
              className="w-full p-2 border rounded"
            >
              <option value="Metro">Metro (₹600/day)</option>
              <option value="Class-A">Class-A (₹450/day)</option>
              <option value="Class-B">Class-B (₹300/day)</option>
              <option value="Class-C">Class-C (₹200/day)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Advance Taken (₹)</label>
            <input
              type="number"
              value={employeeDetails.advanceTaken}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, advanceTaken: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Journey Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-sm">Date</th>
                <th className="border p-2 text-sm">From</th>
                <th className="border p-2 text-sm">To</th>
                <th className="border p-2 text-sm">Mode</th>
                <th className="border p-2 text-sm">Distance (km)</th>
                <th className="border p-2 text-sm">Fare (₹)</th>
                <th className="border p-2 text-sm">DA (₹)</th>
                <th className="border p-2 text-sm">Lodging (₹)</th>
                <th className="border p-2 text-sm">Other (₹)</th>
                <th className="border p-2 text-sm">Remarks</th>
                <th className="border p-2 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border p-1">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(index, "date", e.target.value)}
                      className="w-full p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={entry.fromPlace}
                      onChange={(e) => updateEntry(index, "fromPlace", e.target.value)}
                      className="w-full p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={entry.toPlace}
                      onChange={(e) => updateEntry(index, "toPlace", e.target.value)}
                      className="w-full p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <select
                      value={entry.modeOfTravel}
                      onChange={(e) => updateEntry(index, "modeOfTravel", e.target.value)}
                      className="w-full p-1 text-sm"
                    >
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Flight">Flight</option>
                      <option value="Taxi">Taxi</option>
                      <option value="Own Vehicle">Own Vehicle</option>
                    </select>
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={entry.distance}
                      onChange={(e) => updateEntry(index, "distance", parseFloat(e.target.value) || 0)}
                      className="w-20 p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={entry.fareAmount}
                      onChange={(e) => updateEntry(index, "fareAmount", parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <div className="flex">
                      <input
                        type="number"
                        value={entry.daAmount}
                        onChange={(e) => updateEntry(index, "daAmount", parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 text-sm"
                      />
                      <button
                        onClick={() => calculateDA(index)}
                        className="ml-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                        title="Auto calculate DA"
                      >
                        Auto
                      </button>
                    </div>
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={entry.lodgingAmount}
                      onChange={(e) => updateEntry(index, "lodgingAmount", parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={entry.otherExpenses}
                      onChange={(e) => updateEntry(index, "otherExpenses", parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={entry.remarks}
                      onChange={(e) => updateEntry(index, "remarks", e.target.value)}
                      className="w-full p-1 text-sm"
                    />
                  </td>
                  <td className="border p-1">
                    <button
                      onClick={() => removeEntry(index)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addEntry}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Fare: ₹{totalFare.toFixed(2)}</p>
            <p className="font-medium">Total DA: ₹{totalDA.toFixed(2)}</p>
            <p className="font-medium">Total Lodging: ₹{totalLodging.toFixed(2)}</p>
            <p className="font-medium">Total Other Expenses: ₹{totalOther.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Grand Total: ₹{grandTotal.toFixed(2)}</p>
            <p className="font-medium">Less: Advance Taken: ₹{employeeDetails.advanceTaken.toFixed(2)}</p>
            <p className="font-semibold text-lg text-green-600">Net Payable: ₹{netPayable.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 font-semibold"
      >
        Generate & Print TA/DA Bill
      </button>

      {/* Print Preview */}
      <div id="print-area" className="hidden print:block">
        <div className="p-8 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">TRAVELLING ALLOWANCE / DAILY ALLOWANCE BILL</h1>
          
          <div className="mb-6">
            <table className="w-full border-collapse border">
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Name</td>
                  <td className="border p-2">{employeeDetails.name}</td>
                  <td className="border p-2 font-medium">Employee ID</td>
                  <td className="border p-2">{employeeDetails.employeeId}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Designation</td>
                  <td className="border p-2">{employeeDetails.designation}</td>
                  <td className="border p-2 font-medium">Department</td>
                  <td className="border p-2">{employeeDetails.department}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Purpose</td>
                  <td className="border p-2" colSpan={3}>{employeeDetails.purpose}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Period</td>
                  <td className="border p-2" colSpan={3}>
                    From: {employeeDetails.periodFrom} To: {employeeDetails.periodTo}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">From</th>
                  <th className="border p-2">To</th>
                  <th className="border p-2">Mode</th>
                  <th className="border p-2">Distance</th>
                  <th className="border p-2">Fare</th>
                  <th className="border p-2">DA</th>
                  <th className="border p-2">Lodging</th>
                  <th className="border p-2">Other</th>
                  <th className="border p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {entries.filter(e => e.date).map((entry, index) => {
                  const rowTotal = (Number(entry.fareAmount) || 0) + (Number(entry.daAmount) || 0) + 
                                   (Number(entry.lodgingAmount) || 0) + (Number(entry.otherExpenses) || 0);
                  return (
                    <tr key={index}>
                      <td className="border p-2">{entry.date}</td>
                      <td className="border p-2">{entry.fromPlace}</td>
                      <td className="border p-2">{entry.toPlace}</td>
                      <td className="border p-2">{entry.modeOfTravel}</td>
                      <td className="border p-2 text-center">{entry.distance} km</td>
                      <td className="border p-2 text-right">₹{entry.fareAmount.toFixed(2)}</td>
                      <td className="border p-2 text-right">₹{entry.daAmount.toFixed(2)}</td>
                      <td className="border p-2 text-right">₹{entry.lodgingAmount.toFixed(2)}</td>
                      <td className="border p-2 text-right">₹{entry.otherExpenses.toFixed(2)}</td>
                      <td className="border p-2 text-right font-medium">₹{rowTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="font-semibold">
                  <td colSpan={5} className="border p-2 text-right">TOTAL</td>
                  <td className="border p-2 text-right">₹{totalFare.toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{totalDA.toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{totalLodging.toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{totalOther.toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Grand Total:</td>
                  <td className="text-right font-semibold">₹{grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Less: Advance Taken:</td>
                  <td className="text-right">₹{employeeDetails.advanceTaken.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-lg">Net Amount Payable:</td>
                  <td className="text-right font-semibold text-lg">₹{netPayable.toFixed(2)}</td>
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
              <div className="text-center">
                <p>_______________________</p>
                <p>Authorized Signatory</p>
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