function schedule() {
    var priorityInputs = document.getElementsByClassName("priority");
    var arrivalTimeInputs = document.getElementsByClassName("arrival-time");
    var burstTimeInputs = document.getElementsByClassName("burst-time");
  
    var processes = [];
  
    for (var i = 0; i < priorityInputs.length; i++) {
      var process = {
        id: i + 1,
        priority: parseInt(priorityInputs[i].value),
        arrivalTime: parseInt(arrivalTimeInputs[i].value),
        burstTime: parseInt(burstTimeInputs[i].value)
      };
  
      processes.push(process);
    }
  
    processes.sort(function(a, b) {
      if (a.priority !== b.priority) {
        return a.priority - b.priority; 
      } else {
        return a.arrivalTime - b.arrivalTime; 
      }
    });
  
    var output = document.getElementById("output");
    output.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Priority</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    for (var i = 0; i < processes.length; i++) {
      output.innerHTML += `
        <tr>
          <td>${processes[i].id}</td>
          <td>${processes[i].priority}</td>
          <td>${processes[i].arrivalTime}</td>
          <td>${processes[i].burstTime}</td>
        </tr>
      `;
    }
  
    output.innerHTML += `
        </tbody>
      </table>
    `;
  }
  