import { useState, useEffect } from "react";
import { Dropdown, Container, Checkbox } from "semantic-ui-react";
import Plot from "react-plotly.js";

let dropdownOptions = [];

const App = () => {
  const [data, setData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [plotData, setPlotData] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        "https://opensheet.elk.sh/1T-Ti5e1d8H00-dJYqKU1dKcMsPBNUoHCWvC9c19zBIo/Sheet1"
      );
      const jsonData = await res.json();
      jsonData.forEach((movie) => {
        dropdownOptions.push({ key: movie.name, value: movie.name, text: movie.name });
      });
      setData(jsonData);
    }
    getData();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const movieToPlot = data.filter((movie) => movie.name === selectedMovie)[0];

      Object.keys(movieToPlot).forEach((key) => {
        if (movieToPlot[key] === "") {
          delete movieToPlot[key];
        }
      });

      const xVals = Object.keys(movieToPlot);
      const yVals = Object.values(movieToPlot);
      xVals.pop();
      yVals.pop();

      for (let i = 0; i < yVals.length; i++) {
        if (yVals[i] === "") {
          yVals[i] = 0;
        }
      }

      const trace1 = {
        x: xVals,
        y: yVals,
        mode: isChecked ? "" : "markers",
        type: "scatter",
      };

      setPlotData([trace1]);
    }
  }, [selectedMovie, isChecked, data]);

  const handleCheckbox = (e, { checked }) => {
    setIsChecked(checked);
  };

  const handleMovieSelected = (event, { value }) => {
    setSelectedMovie(value);
  };

  return (
    <Container textAlign="center">
      {data ? (
        <div>
          <Checkbox onChange={handleCheckbox} label="Line Graph" />

          <Dropdown
            value={selectedMovie}
            placeholder="Select Movie"
            onChange={handleMovieSelected}
            fluid
            search
            selection
            options={dropdownOptions}
          />
          <Plot
            data={plotData}
            layout={{
              xaxis: {
                tickmode: "linear",
                title: "Frequency (Hz)",
              },
              yaxis: {
                tickmode: "linear",
                title: "dBFS",
              },
            }}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </Container>
  );
};

export default App;
