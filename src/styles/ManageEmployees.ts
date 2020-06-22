import { flexContainer } from './flexContainer'

export const manageEmployeesStyles = `
  justify-content: flex-start;

  .employeesContainer{
    min-height: 200px;
    min-width: 300px;
    display:flex;
    justify-content: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  section { 
    ${flexContainer}
    justify-content: flex-start;
    margin-bottom: 50px;
    min-height: auto;
  }

  .headerContainer {
    width: 100%;
    display:flex;
    justify-content: space-between;  
  }
`
