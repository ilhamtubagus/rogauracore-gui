import path, { join, resolve } from "path";

import "./App.css";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Button,
  Checkbox,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { HexColorPicker } from "react-colorful";
import { useDebounce } from "use-debounce";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
const ipcRenderer = window.require("electron").ipcRenderer;
const exec = window.require("child_process").exec;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function App() {
  const [effect, setEffect] = React.useState("static");
  const [colorCount, setColorCount] = React.useState(0);
  const [brightness, setBrightness] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState({
    msg: "",
    open: false,
    severity: "info",
  });
  const [color1, setColor1] = React.useState("#363537");
  const [color2, setColor2] = React.useState("#363537");
  const [color3, setColor3] = React.useState("#363537");
  const [color4, setColor4] = React.useState("#363537");
  //debounce colors for performance
  const [color1D] = useDebounce(color1, 200);
  const [color2D] = useDebounce(color2, 200);
  const [color3D] = useDebounce(color3, 200);
  const [color4D] = useDebounce(color4, 200);
  const [forceReload, setForceReload] = React.useState(false);
  let rogAuraExecPath = "";
  const [selectedColor, setSelectedColor] = React.useState(0);
  const handleChangeEffect = (event, newValue) => {
    setEffect(newValue);
  };
  const handleColorCountChange = (event) => {
    if (event.target.value === 0) {
      setSelectedColor(0);
    }
    if (event.target.value === 1) {
      setEffect("static");
    }
    setColorCount(event.target.value);
  };
  const handleChangeBrightness = (event) => {
    setBrightness(event.target.value);
  };
  const handleChangeSpeed = (event) => {
    setSpeed(event.target.value);
  };
  const handleOpenSnackbar = (msg, severity) => {
    setSnackbar({ msg: msg, open: true, severity: severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({
      msg: "",
      open: false,
      severity: "info",
    });
  };

  const handleChangeForceReload = (event) => {
    setForceReload(event.target.checked);
  };

  const handleChangePicker = (newColor) => {
    switch (selectedColor) {
      case 0:
        setColor1(newColor);
        break;
      case 1:
        setColor2(newColor);
        break;
      case 2:
        setColor3(newColor);
        break;
      case 3:
        setColor4(newColor);
        break;
      default:
    }
  };
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClose = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };
  // apply setting
  const handleApplySettings = async () => {
    handleToggleBackdrop();
    // apply setting by calling rogauracore bin file
    if (rogAuraExecPath === "") {
      let appPath = await ipcRenderer.invoke("getAppPath");
      if (path.basename(appPath) === "app.asar") {
        appPath = path.dirname(appPath);
        appPath = appPath.replace(/ /g, "\\ ");
      }
      rogAuraExecPath = join(appPath + "/bin/rogauracore");
    }
    let auraCoreCmd = ``;
    // single section
    if (colorCount === 0) {
      switch (effect) {
        case "static":
          auraCoreCmd = `${rogAuraExecPath} single_static ${color1D.substring(
            1
          )}`;
          break;
        case "breathing":
          auraCoreCmd = `${rogAuraExecPath} single_breathing ${color1D.substring(
            1
          )} ${color2D.substring(1)} ${speed}`;

          break;
        case "cycle":
          auraCoreCmd = `${rogAuraExecPath} single_colorcycle ${speed}`;
          break;
        default:
          break;
      }
    } else {
      // multiple section
      switch (effect) {
        case "static":
          auraCoreCmd = `${rogAuraExecPath} multi_static ${color1D.substring(
            1
          )} ${color2D.substring(1)} ${color3D.substring(
            1
          )} ${color4D.substring(1)}`;
          break;
        case "breathing":
          auraCoreCmd = `${rogAuraExecPath} multi_breathing ${color1D.substring(
            1
          )} ${color2D.substring(1)} ${color3D.substring(
            1
          )} ${color4D.substring(1)} ${speed}`;

          break;
        default:
          break;
      }
    }
    let execCmd = `pkexec sh -c "${rogAuraExecPath}  initialize_keyboard; echo '${brightness}' > /sys/class/leds/asus::kbd_backlight/brightness; ${auraCoreCmd}"`;
    if (forceReload) {
      execCmd = `pkexec sh -c "${rogAuraExecPath}  initialize_keyboard; echo '${brightness}' > /sys/class/leds/asus::kbd_backlight/brightness; ${auraCoreCmd}; systemctl restart upower.service"`;
    }
    exec(execCmd, (err, stdout, stderr) => {
      handleClose();
    });
  };

  const renderColorSelection = () => {
    if (colorCount === 0) {
      if (effect === "static") {
        return (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                padding: 5,
              }}
            >
              <div
                onClick={() => setSelectedColor(0)}
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: color1D,
                  borderRadius: 2,
                  cursor: "pointer",
                  border:
                    selectedColor === 0
                      ? "5px solid #46a1d9"
                      : "5px solid #eceef3",
                }}
              />
            </div>
          </React.Fragment>
        );
      } else if (effect === "breathing") {
        return (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                padding: 5,
              }}
            >
              <div
                onClick={() => setSelectedColor(0)}
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: color1D,
                  borderRadius: 2,
                  cursor: "pointer",
                  border:
                    selectedColor === 0
                      ? "5px solid #46a1d9"
                      : "5px solid #eceef3",
                  marginRight: "30px",
                }}
              />
              <div
                onClick={() => setSelectedColor(1)}
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: color2D,
                  borderRadius: 2,
                  cursor: "pointer",
                  border:
                    selectedColor === 1
                      ? "5px solid #46a1d9"
                      : "5px solid #eceef3",
                }}
              />
            </div>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              padding: 5,
            }}
          >
            <div
              onClick={() => setSelectedColor(0)}
              style={{
                width: 45,
                height: 45,
                backgroundColor: color1D,
                borderRadius: 2,
                cursor: "pointer",
                border:
                  selectedColor === 0
                    ? "5px solid #46a1d9"
                    : "5px solid #eceef3",
                marginRight: "30px",
              }}
            />

            <div
              onClick={() => setSelectedColor(1)}
              style={{
                width: 45,
                height: 45,
                backgroundColor: color2D,
                borderRadius: 2,
                cursor: "pointer",
                border:
                  selectedColor === 1
                    ? "5px solid #46a1d9"
                    : "5px solid #eceef3",
                marginRight: "30px",
              }}
            />
            <div
              onClick={() => setSelectedColor(2)}
              style={{
                width: 45,
                height: 45,
                backgroundColor: color3D,
                borderRadius: 2,
                cursor: "pointer",
                border:
                  selectedColor === 2
                    ? "5px solid #46a1d9"
                    : "5px solid #eceef3",
                marginRight: "30px",
              }}
            />
            <div
              onClick={() => setSelectedColor(3)}
              style={{
                width: 45,
                height: 45,
                backgroundColor: color4D,
                borderRadius: 2,
                cursor: "pointer",
                border:
                  selectedColor === 3
                    ? "5px solid #46a1d9"
                    : "5px solid #eceef3",
              }}
            />
          </div>
        </React.Fragment>
      );
    }
  };
  return (
    <Paper
      sx={{
        bgcolor: "#ebeef3",
        display: "flex",
        height: "600px",
        padding: 5,
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={5}>
        <Grid item sm={7}>
          <Typography sx={{ marginLeft: 1 }}>COLOR</Typography>
          <HexColorPicker
            style={{ width: "100%" }}
            onChange={handleChangePicker}
          />
        </Grid>
        <Grid item sm={5}>
          <Paper sx={{ padding: 3 }}>
            <Typography sx={{ marginLeft: 1 }}>MODE</Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={colorCount}
                onChange={handleColorCountChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem value={0}>Single Section</MenuItem>
                <MenuItem value={1}>Multiple Section</MenuItem>
              </Select>
            </FormControl>
            {renderColorSelection()}
            <Divider sx={{ marginTop: 1 }} />
            <Typography sx={{ marginLeft: 1, marginTop: 2 }}>EFFECT</Typography>
            <FormControl component="fieldset" sx={{ marginLeft: 1 }}>
              <RadioGroup
                aria-label="gender"
                name="controlled-radio-buttons-group"
                value={effect}
                onChange={handleChangeEffect}
              >
                <FormControlLabel
                  value="static"
                  control={<Radio />}
                  label="Static"
                />
                <FormControlLabel
                  value="breathing"
                  control={<Radio />}
                  label="Breathing"
                />
                {colorCount === 0 && (
                  <FormControlLabel
                    value="cycle"
                    control={<Radio />}
                    label="Color Cycle"
                  />
                )}
              </RadioGroup>
            </FormControl>
            <Divider />
            <Typography sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2 }}>
              BRIGHTNESS
            </Typography>
            <Slider
              aria-label="Always visible"
              defaultValue={50}
              onChange={handleChangeBrightness}
              valueLabelDisplay="auto"
              value={brightness}
              step={1}
              min={0}
              max={4}
              marks
              sx={{ marginBottom: 2 }}
            />
            {effect !== "static" && (
              <React.Fragment>
                <Divider />
                <Typography
                  sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2 }}
                >
                  SPEED
                </Typography>
                <Slider
                  aria-label="Always visible"
                  defaultValue={50}
                  onChange={handleChangeSpeed}
                  valueLabelDisplay="auto"
                  value={speed}
                  step={1}
                  min={1}
                  max={3}
                  marks
                  sx={{ marginBottom: 2, padding: 3 }}
                />
              </React.Fragment>
            )}
            <FormControlLabel
              value={forceReload}
              onChange={handleChangeForceReload}
              control={<Checkbox name="forceReload" />}
              label="Force Reload System Power"
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={handleApplySettings}>
              Apply
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default App;
