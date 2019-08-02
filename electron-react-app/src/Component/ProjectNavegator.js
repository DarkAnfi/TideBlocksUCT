import React, {Component} from 'react';
import { Tooltip, Nav, NavItem, NavLink, Button } from 'reactstrap';
import LinkedListNode from '../Classes/LinkedListNode';
import classnames from 'classnames';
import './ProjectNavegator.css';

class ProjectNavegator extends Component{
    constructor(props){
        super(props);
        this.toggleTab = this.toggleTab.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.handlerCloseProject = this.handlerCloseProject.bind(this);
        this.handlerAddProject = this.handlerAddProject.bind(this);
        this.handlerScrollRight = this.handlerScrollRight.bind(this);
        this.handlerScrollLeft = this.handlerScrollLeft.bind(this);
        this.handlerResize = this.handlerResize.bind(this);
    }

    toggleTooltip(indx){
        const tooltipOpen = this.props.app.tooltipOpen;
        tooltipOpen[indx] = !tooltipOpen[indx];
        this.props.app.set({
            tooltipOpen
          });
    }

    toggleTab(tab){
        if (this.props.app.currentProject !== tab) {
            this.props.app.set({
                currentProject: tab
            });
        }
    }

    handlerAddProject(tab=null){
        let newTab = {};
        let projectList = this.props.app.projectList;
        let projectListVisible = this.props.app.projectListVisible;
        let tooltipOpen = this.props.app.tooltipOpen;
        let LastProject = this.props.app.LastVisibleProject;
        let FirstVisibleProject = this.props.app.FirstVisibleProject;
        if(170*(this.props.app.projectList.length+1) + 15+36.95*3 < window.innerWidth){
            if(tab.type && tab.type === 'click'){
                newTab = {id: 'project' + this.props.app.idProjectCounter, 
                filename: 'New Tab',
                imports: ["Servo.h"],
                defaults: [
                  { block: 'execute', command: 'Servo SERVO1' },
                  { block: 'execute', command: 'Servo SERVO2' }
                ],
                setup: [
                  { block: 'execute', command: 'pinMode(4, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(5, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(6, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(13, OUTPUT)' },
                  { block: 'execute', command: 'SERVO1.attach(12)' },
                  { block: 'execute', command: 'SERVO2.attach(11)' }
                ],
                loop: [],
                variables: {},
                savedState: "",
                currentState: new LinkedListNode("")};

                projectList = projectList.push(newTab);
                projectListVisible = projectListVisible.push(newTab);
                tooltipOpen = tooltipOpen.push(false);
                LastProject = newTab;
                if(FirstVisibleProject === []){FirstVisibleProject = newTab;}
                this.props.app.set({
                    projectList: projectList,
                    projectListVisible: projectListVisible,
                    tooltipOpen: tooltipOpen
                },
                ()=>{
                    const newId = this.props.app.idProjectCounter + 1;
                    this.props.app.set({
                        FirstVisibleProject: FirstVisibleProject,
                        LastVisibleProject: LastProject,
                        idProjectCounter: newId
                    });
                });
            }else{
                newTab = tab;
                newTab.id = 'project' + this.props.app.idProjectCounter;
                projectList = projectList.push(newTab);
                projectListVisible = projectListVisible.push(newTab);
                tooltipOpen = tooltipOpen.push(false);
                if(FirstVisibleProject === []){FirstVisibleProject = newTab;}
                LastProject = newTab;
                this.props.app.set({
                    projectList: projectList,
                    projectListVisible: projectListVisible,
                    tooltipOpen: tooltipOpen
                },
                ()=>{
                    const newId = this.props.app.idProjectCounter + 1;
                    this.props.app.set({
                        FirstVisibleProject: FirstVisibleProject,
                        LastVisibleProject: LastProject,
                        idProjectCounter: newId
                    });
                });
            }
            this.props.app.set({
                currentProject: newTab
            });
        }else if(170*(this.props.app.projectList.length + 1)+15+36.95*3 >= window.innerWidth){
            if(tab.type && tab.type === 'click'){
                newTab = {id: 'project' + this.props.app.idProjectCounter, 
                filename: 'New Tab',
                imports: ["Servo.h"],
                defaults: [
                  { block: 'execute', command: 'Servo SERVO1' },
                  { block: 'execute', command: 'Servo SERVO2' }
                ],
                setup: [
                  { block: 'execute', command: 'pinMode(4, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(5, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(6, OUTPUT)' },
                  { block: 'execute', command: 'pinMode(13, OUTPUT)' },
                  { block: 'execute', command: 'SERVO1.attach(12)' },
                  { block: 'execute', command: 'SERVO2.attach(11)' }
                ],
                loop: [],
                variables: {},
                savedState: "",
                currentState: new LinkedListNode("")};

                projectList = projectList.push(newTab);
                tooltipOpen = tooltipOpen.push(false);
                this.props.app.set({
                    projectList: projectList,
                    tooltipOpen: tooltipOpen
                },
                ()=>{
                    const newId = this.props.app.idProjectCounter + 1;
                    this.props.app.set({
                        idProjectCounter: newId
                    });
                });
            }else{
                newTab = tab;
                newTab.id = 'project' + this.props.app.idProjectCounter;
                projectList = projectList.push(newTab);
                tooltipOpen = tooltipOpen.push(false);
                this.props.app.set({
                    projectList: projectList,
                    tooltipOpen: tooltipOpen
                },
                ()=>{
                    const newId = this.props.app.idProjectCounter + 1;
                    this.props.app.set({
                        idProjectCounter: newId
                    });
                });
            }
        }
    }

    handlerCloseProject(tab){
        //validations to save projects if the user wishes (changes?)
        let indx = this.props.app.projectList.indexOf(tab);
        let tooltipOpen = this.props.app.tooltipOpen;
        let LastVisibleProject2 = this.props.app.LastVisibleProject;
        let FirstVisibleProject2 = this.props.app.FirstVisibleProject;
        let projectList = this.props.app.projectList;

        if(LastVisibleProject2 === tab && FirstVisibleProject2 === tab){
            LastVisibleProject2 = {};
            FirstVisibleProject2 = {};
        }else if(LastVisibleProject2 === tab){
            LastVisibleProject2 = projectList[indx - 1];
        }else if(FirstVisibleProject2 === tab){
            FirstVisibleProject2 = projectList[indx + 1]
        }else{
            LastVisibleProject2 = projectList[indx + 1];
        }
        console.log(FirstVisibleProject2, LastVisibleProject2);
        this.props.app.set({
            FirstVisibleProject: FirstVisibleProject2,
            LastVisibleProject: LastVisibleProject2
        },()=>{console.log(this.props.app.FirstVisibleProject, this.props.app.LastVisibleProject);});

        projectList.splice(indx, 1);
        tooltipOpen.splice(indx, 1);
        //tooltipOpen = tooltipOpen.filter((_, i)=> i !== indx)

        this.props.app.set({
            projectList: projectList,
            tooltipOpen: tooltipOpen
        },
        ()=>{
            let newTabActive = {};
            if(this.props.app.projectList && this.props.app.projectList.length){
                if(this.props.app.projectList[indx]){
                    newTabActive = this.props.app.projectList[indx];
                }else if(this.props.app.projectList[indx - 1]){
                    newTabActive = this.props.app.projectList[indx - 1];
                }
                this.props.app.set({
                    currentProject: newTabActive
                });
            }
        });
    }

    handlerScrollRight(e){
        if((parseInt(this.props.app.LastVisibleProject.id.substr(7,)) + 1 < this.props.app.projectList.length) && (170*this.props.app.projectList.length + 15 > window.innerWidth)){
            const projectListVisible = this.props.app.projectList.slice(parseInt(this.props.app.FirstVisibleProject.id.substr(7,))+1, parseInt(this.props.app.LastVisibleProject.id.substr(7,))+2);
            this.props.app.set({
                projectListVisible
            },
            ()=>{
                this.updateVisibleTabs(this.props.app.projectListVisible[0], this.props.app.projectListVisible[this.props.app.projectListVisible.length-1]);
            });
        }
    }

    handlerScrollLeft(e){
        if((parseInt(this.props.app.FirstVisibleProject.id.substr(7,)) - 1 >= 0) && (170*this.props.app.projectList.length + 15 > window.innerWidth)){
            const projectListVisible = this.props.app.projectList.slice(parseInt(this.props.app.FirstVisibleProject.id.substr(7,))-1, parseInt(this.props.app.LastVisibleProject.id.substr(7,)));
            this.props.app.set({
                projectListVisible
            },
            ()=>{
                this.updateVisibleTabs(this.props.app.projectListVisible[0], this.props.app.projectListVisible[this.props.app.projectListVisible.length-1]);
            });
        }
    }

    handlerResize(e){//validar cuando no hay tab
        //console.log(this.props.app.LastVisibleProject);
        if(window.innerWidth >= (170*(this.props.app.projectListVisible.length+1)+15+36.95*3) && this.props.app.LastVisibleProject !== {}){
            let LastVisibleProject = this.props.app.LastVisibleProject;
            if(parseInt(LastVisibleProject.id.substr(7,)) === parseInt(this.props.app.projectList[this.props.app.projectList.length-1].id.substr(7,))){
                const projectListVisible = this.props.app.projectList.slice(parseInt(this.props.app.FirstVisibleProject.id.substr(7,))-1, parseInt(this.props.app.LastVisibleProject.id.substr(7,))+1);
                this.props.app.set({
                    projectListVisible
                },
                ()=>{
                    this.updateVisibleTabs(this.props.app.projectListVisible[0], this.props.app.projectListVisible[this.props.app.projectListVisible.length-1]);
                });
            }else{
                const projectListVisible = this.props.app.projectList.slice(parseInt(this.props.app.FirstVisibleProject.id.substr(7,)), parseInt(this.props.app.LastVisibleProject.id.substr(7,))+2);
                this.props.app.set({
                    projectListVisible
                },
                ()=>{
                    this.updateVisibleTabs(this.props.app.projectListVisible[0], this.props.app.projectListVisible[this.props.app.projectListVisible.length-1]);
                });
            }
        }else{
            if(window.innerWidth < (170*(this.props.app.projectListVisible.length)+15+36.95*3)){
                const projectListVisible = this.props.app.projectList.slice(parseInt(this.props.app.FirstVisibleProject.id.substr(7,)), Math.trunc((window.innerWidth-15-36.95*3)/170));
                this.props.app.set({
                    projectListVisible
                },
                ()=>{
                    this.updateVisibleTabs(this.props.app.projectListVisible[0], this.props.app.projectListVisible[this.props.app.projectListVisible.length-1]);
                });
            }
        }
    }

    updateVisibleTabs(first, last){
        this.props.app.set({
            LastVisibleProject: last,
            FirstVisibleProject: first
        });
    }

    componentDidMount(){
        window.addEventListener("resize", this.handlerResize);
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.props.app;
    }*/
    
    render(){
        const TabsCreated = this.props.app.projectListVisible.map((project, indx)=>{
            return (<div key={indx}>
                <NavItem  className='tab'>
                    <NavLink id={project.id} className={classnames({ active: this.props.app.currentProject.id === project.id})} onClick={()=>{this.toggleTab(project);}}>
                        <span className='tab-label'>{project.filename}</span> <Button className='close' onClick={()=>{this.handlerCloseProject(project);}} close />
                        <Tooltip placement="bottom" isOpen={this.props.app.tooltipOpen[indx]} autohide={false} target={project.id} toggle={()=>{this.toggleTooltip(indx)}}>
                            {project.filename}
                        </Tooltip>
                    </NavLink>
                </NavItem>
            </div>);
        });
        return(
            <div>
                <Button outline className='float-right add-project' onClick={this.handlerAddProject}>+</Button>
                <Button outline className='float-right add-project' onClick={this.handlerScrollRight}>{'>'}</Button>
                <Button outline className='float-left add-project' onClick={this.handlerScrollLeft}> {'<'} </Button>
                
                <Nav tabs className='project-navegator'>
                    <div className='scrolling-wrapper '>  
                        {
                            TabsCreated
                        }
                    </div>
                </Nav>
                
            </div>
        );
    }
}
export default ProjectNavegator;