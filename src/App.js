import { useState, useEffect } from "react";
import { Dropdown, Container, Checkbox } from "semantic-ui-react";
import Plot from "react-plotly.js";

let dropdownOptions = [];

const App = () => {
  const [data, setData] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [plotData, setPlotData] = useState([]);
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

  const traces = [];

  useEffect(() => {
    if (selectedMovies.length) {
      selectedMovies.forEach((movie) => {
        const movieToPlot = data.filter((obj) => obj.name === movie)[0];

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

        const trace = {
          x: xVals,
          y: yVals,
          mode: isChecked ? "" : "markers",
          type: "scatter",
          name: movie,
        };

        traces.push(trace);
        setPlotData(traces);
      });
    }
  }, [selectedMovies, isChecked]);

  const handleCheckbox = (e, { checked }) => {
    setIsChecked(checked);
  };

  const handleMovieSelected = (event, { value }) => {
    setSelectedMovies(value);
  };

  return (
    <Container textAlign="center">
      {data.length ? (
        <div>
          <Checkbox onChange={handleCheckbox} label="Line Graph" />
          <Dropdown
            placeholder="Select Movie"
            onChange={handleMovieSelected}
            fluid
            multiple
            search
            selection
            options={dropdownOptions}
          />
          <Plot
            data={plotData}
            layout={{
              autosize: true,
              xaxis: {
                tickmode: "auto",
                title: "Frequency (Hz)",
              },
              yaxis: {
                tickmode: "linear",
                title: "dBFS",
              },
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </Container>
  );
};

export default App;
