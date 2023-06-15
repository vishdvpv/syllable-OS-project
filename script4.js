class Process
{
    constructor(pid,bt,art)
    {
        this.pid = pid;   
        this.bt = bt;   
        this.art = art;   
    }
}

let proc = [];
let id_num = 1;
let avg_waiting_time;
let avg_turnaround_time;
let waitingtime1 = [];
let turnaroundtime1 = [];

function adddata() {
    let AT= parseInt(document.sample.arrival.value);
    let BT = parseInt(document.sample.burst.value); 
    if(isNaN(BT)){
        alert("Enter burst time")
    }
    else if(isNaN(AT)){
        alert("Enter the arrival time")
    }
    else{
        proc.push(new Process(id_num,BT,AT));
        let tr = document.createElement('tr');
        let td0 = tr.appendChild(document.createElement('td'));
        let td1 = tr.appendChild(document.createElement('td'));
        let td2 = tr.appendChild(document.createElement('td'));
        td0.innerHTML = id_num;
        td1.innerHTML = AT;
        td2.innerHTML = BT;
        id_num++
        document.getElementById("tb1").appendChild(tr);
    }
}

function findWaitingTime(proc, n, wt){
        let rt = new Array(n);
        for (let i = 0; i < n; i++)
            rt[i] = proc[i].bt;
        
        let complete = 0, t = 0, minm = Number.MAX_VALUE;
        let shortest = 0, finish_time;
        let check = false;
        while (complete != n) {
            for (let j = 0; j < n; j++)
            {
                if ((proc[j].art <= t) &&
                  (rt[j] < minm) && rt[j] > 0) {
                    minm = rt[j];
                    shortest = j;
                    check = true;
                }
            }
        
            if (check == false) {
                t++;
                continue;
            }
            rt[shortest]--;
            minm = rt[shortest];
            if (minm == 0)
                minm = Number.MAX_VALUE;
            if (rt[shortest] == 0) {
                complete++;
                check = false;
                finish_time = t + 1;
                wt[shortest] = finish_time -
                             proc[shortest].bt -
                             proc[shortest].art;
        
                if (wt[shortest] < 0)
                    wt[shortest] = 0;
            }
            t++;
        }
}

function findTurnAroundTime(proc,n,wt,tat)
{
        for (let i = 0; i < n; i++)
            tat[i] = proc[i].bt + wt[i];
}

function findavgTime()
{
        let n = proc.length;
        let wt = new Array(n), tat = new Array(n);
        let  total_wt = 0, total_tat = 0;
        findWaitingTime(proc, n, wt);
        findTurnAroundTime(proc, n, wt, tat);
        for (let i = 0; i < n; i++) {
            total_wt = total_wt + wt[i];
            total_tat = total_tat + tat[i];
        }
        
        avg_waiting_time = total_wt / n;
        avg_turnaround_time =total_tat / n;
        for (let i = 0; i < n; i++) {
            waitingtime1.push(wt[i]);
            turnaroundtime1.push(tat[i]);
        }
        
}
function submitdata(){
    findavgTime();
    funCall();
}

function funCall() {
    let html = '';
    let num = proc.length;
    setTimeout(() => {
      for (let i = 0; i < num; i++) {
        html += '<tr>';
        html += '<td>' + proc[i].pid + '</td>';
        html += '<td>' + proc[i].art + '</td>';
        html += '<td>' + proc[i].bt + '</td>';
        html += '<td>' + waitingtime1[i] + '</td>';
        html += '<td>' + turnaroundtime1[i] + '</td>';
        html += '</tr>';
      }
      document.getElementById("tb2").innerHTML += html;
    }, 1000);

    document.getElementById("avgwait1").innerHTML = avg_waiting_time;
    document.getElementById("avgturn1").innerHTML = avg_turnaround_time;

    drawChart();
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
    for(let i = 0; i < proc.length; i++){
        let processId = proc[i].pid;
        let turnaroundTime = turnaroundtime1[i];
        let startDate = new Date(currentDate.getTime());
        let endDate = new Date(startDate.getTime() + daysToMilliseconds(turnaroundTime));
        let duration = daysToMilliseconds(turnaroundTime);
        let percentComplete = 100;
        let dependency = (i > 0) ? proc[i-1].pid.toString() : null;

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
