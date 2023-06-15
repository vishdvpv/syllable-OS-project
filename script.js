let burst_time = [];
let priority = [];
let id_num = 1;

function adddata() {
  let BT = parseInt(document.sample.data.value);
  let PRIOR = parseInt(document.sample.weight.value);
  if(isNaN(BT)){
    alert("Enter burst time")
  }
  else if(isNaN(PRIOR)){
    alert("Enter the weight of the data")
  }
  else{
    burst_time.push(BT);
    priority.push(PRIOR);
    let tr = document.createElement("tr");
    let td0 = tr.appendChild(document.createElement("td"));
    let td1 = tr.appendChild(document.createElement("td"));
    let td2 = tr.appendChild(document.createElement("td"));
    td0.innerHTML = id_num;
    td1.innerHTML = BT;
    td2.innerHTML = PRIOR;
    id_num++;
    document.getElementById("tb1").appendChild(tr);
  }
}

let pid1 = [];
let bt1 = [];
let prior1 = [];
let time_slice1 = [];
let exetime1 = [];

function submitdata() {
  let quantum = parseInt(document.sample.timequantum.value);
  if(burst_time.length == 0){
    alert("Enter data for weight and burst time");
  }
  else if (isNaN(quantum)) {
    alert("Enter data for the time quantum")
  } 
  else{
  let num_flows = burst_time.length;
  let q = [];
  let time = 0;
  let remaining_time = [];
  let time_slice = [];
  let executed_time = [];
  let weights = [];
  let total_weight = 0;
  let completion_time = [];

  for (let i = 0; i < num_flows; i++) {
    remaining_time[i] = burst_time[i];
    executed_time[i] = 0;
    weights[i] = priority[i];
    total_weight += weights[i];
  }

  while (true) {
    let done = true;

    for (let i = 0; i < num_flows; i++) {
      if (remaining_time[i] > 0) {
        done = false;

        if (remaining_time[i] <= quantum) {
          time += remaining_time[i];
          executed_time[i] += remaining_time[i];
          remaining_time[i] = 0;
          completion_time[i] = time;
        } else {
          time += quantum;
          executed_time[i] += quantum;
          remaining_time[i] -= quantum;
        }

        time_slice[i] = executed_time[i] / weights[i];
        q.push(i + 1);
      }
    }

    if (done === true) break;
  }
  for (let i = 0; i < num_flows; i++) {
    pid1.push(i + 1);
    bt1.push(burst_time[i]);
    prior1.push(priority[i]);
    time_slice1.push(time_slice[i]);
    exetime1.push(completion_time[i]);
  }
  funCall();

  }
}

function funCall() {
  let html = "";
  let num_flows = burst_time.length;
  setTimeout(() => {
    for (let i = 0; i < num_flows; i++) {
      html += "<tr>";
      html += "<td>" + pid1[i] + "</td>";
      html += "<td>" + bt1[i] + "</td>";
      html += "<td>" + prior1[i] + "</td>";
      html += "<td>" + time_slice1[i] + "</td>";
      html += "<td>" + exetime1[i] + "</td>";
      html += "</tr>";
    }
    document.getElementById("tb2").innerHTML += html;
    drawChart();
  }, 1000);

}

google.charts.load('current', { 'packages': ['gantt'] });
google.charts.setOnLoadCallback(drawChart);

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

function drawChart() {
  let data = new google.visualization.DataTable();
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('string', 'Resource');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  let rows = []; 

  let currentDate = new Date();
  for (let i = 0; i < pid1.length; i++) {
    let processId = pid1[i];
    let turnaroundTime = exetime1[i];
    let startDate = new Date(currentDate.getTime());
    let endDate = new Date(startDate.getTime() + daysToMilliseconds(turnaroundTime));
    let duration = daysToMilliseconds(turnaroundTime);
    let percentComplete = 100;
    let dependency = (i > 0) ? pid1[i - 1].toString() : null;

    rows.push([
      processId.toString(),
      'Process ' + processId,
      '',
      startDate,
      endDate,
      null,
      percentComplete,
      dependency
    ]);

    currentDate = new Date(endDate.getTime() + 1);
  }

  data.addRows(rows);

  var options = {
    height: 275
  };

  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

  chart.draw(data, options);
}