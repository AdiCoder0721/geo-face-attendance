import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import "./adminPro.css";

const Admin = ({ user, setUser }) => {
  const [attendance, setAttendance] = useState([]);
  const [selected, setSelected] = useState(null); // currently picked for map
  const [lastRefresh, setLastRefresh] = useState(null);
  const [todayDate, setTodayDate] = useState(new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchList();
    const id = setInterval(fetchList, 5000);
    return () => clearInterval(id);
  }, []);

  const fetchList = async () => {
    // refresh today's date header as well, so the UI advances at midnight
    setTodayDate(new Date());

    const res = await API.get("/admin/attendance/today");
    const list = res.data.attendances || [];
    setAttendance(list);
    setLastRefresh(new Date());
  };

  // format seconds to mm:ss
  const formatDuration = (secs) => {
    if (!secs && secs !== 0) return "--";
    const s = Number(secs || 0);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  };

  // 🔍 search filter
  const filtered = useMemo(() => {
    return attendance.filter(a =>
      a.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendance, search]);

  // keep selected entry in sync with filtered list
  useEffect(() => {
    if (filtered.length === 0) {
      setSelected(null);
    } else if (!selected || !filtered.some(a => a._id === selected._id)) {
      setSelected(filtered[0]);
    }
  }, [filtered]);

  // 📄 export csv
  const exportCSV = () => {
    const rows = filtered.map(a => ({
      name: a.studentId?.name,
      email: a.studentId?.email,
      time: new Date(a.createdAt).toLocaleTimeString(),
      status: a.status || 'Present',
      duration: formatDuration(a.durationSeconds),
      lat: a.latitude,
      long: a.longitude
    }));

    const csv =
      "Name,Email,Time,Status,Duration,Lat,Long\n" +
      rows.map(r => Object.values(r).join(",")).join("\n");

    const blob = new Blob([csv]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance.csv";
    a.click();
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>GeoFace</h2>
        <p>Admin Panel</p>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={()=>{
          localStorage.clear();
          setUser(null);
        }}>Logout</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP */}
        <div className="topbar">
          <h3>
            Today {todayDate.toLocaleDateString()}
            <span className="badge">{attendance.filter(a => a.status === 'Present').length} present</span>
          </h3>

          <input
            placeholder="Search student..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            <p>Present Today</p>
            <h1>{attendance.filter(a => a.status === 'Present').length}</h1>
          </div>

          <div className="card">
            <p>Last refresh</p>
            <h1>{lastRefresh?.toLocaleTimeString() || "--"}</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Time</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Lat</th>
                <th>Long</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr
                  key={a._id}
                  className={selected?._id === a._id ? "selected-row" : ""}
                  onClick={() => setSelected(a)}
                >
                  <td>{a.studentId?.name}</td>
                  <td>{a.studentId?.email}</td>
                  <td>{new Date(a.createdAt).toLocaleTimeString()}</td>
                  <td>{a.status || 'Present'}</td>
                  <td>{formatDuration(a.durationSeconds)}</td>
                  <td>{a.latitude?.toFixed(4)}</td>
                  <td>{a.longitude?.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MAP */}
        <div className="map">
          <iframe
            title="map"
            src={`https://maps.google.com/maps?q=${selected?.latitude || 0},${selected?.longitude || 0}&z=15&output=embed`}
          />
        </div>

      </div>
    </div>
  );
};

export default Admin;