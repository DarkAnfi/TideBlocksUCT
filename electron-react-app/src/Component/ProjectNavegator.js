import React, { Component } from 'react';
import { NavItem, NavLink, Button } from 'reactstrap';
import LinkedListNode from '../Classes/LinkedListNode';
import classnames from 'classnames';
import './ProjectNavegator.css';
import Scrollbar from './Scrollbar';

class ProjectNavegator extends Component {
    constructor(props) {
        super(props);
        this.handlerToggleProject = this.handlerToggleProject.bind(this);
        this.handlerCloseProject = this.handlerCloseProject.bind(this);
        this.handlerAddProject = this.handlerAddProject.bind(this);
    }

    handlerToggleProject(tab) {
        if (this.props.app.currentProject !== tab) {
            this.props.app.set({
                currentProject: tab
            });
            //aquí cambiar el workspace
        }
    }

    handlerAddProject(event) {
        console.log(event);     
        const newProject = {
            id: 'project' + this.props.app.idProjectCounter.toString(),
            filename: null,
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
            currentState: new LinkedListNode("")
        };
        const newId = this.props.app.idProjectCounter + 1;
        const { __projectList, set } = this.props.app;
        __projectList[newProject.id] = newProject;
        set({ __projectList, idProjectCounter: newId, currentProject: newProject });
    }

    handlerCloseProject(project) {
        console.log("asdas123");
        /*//validations to save projects if the user wishes (changes?)
        let indx = this.props.app.projectList.indexOf(tab);
        let tooltipOpen = this.props.app.tooltipOpen;
        let LastVisibleProject2 = this.props.app.LastVisibleProject;
        let FirstVisibleProject2 = this.props.app.FirstVisibleProject;
        let projectList = this.props.app.projectList;

        if (LastVisibleProject2 === tab && FirstVisibleProject2 === tab) {
            LastVisibleProject2 = {};
            FirstVisibleProject2 = {};
        } else if (LastVisibleProject2 === tab) {
            LastVisibleProject2 = projectList[indx - 1];
        } else if (FirstVisibleProject2 === tab) {
            FirstVisibleProject2 = projectList[indx + 1]
        } else {
            LastVisibleProject2 = projectList[indx + 1];
        }
        console.log(FirstVisibleProject2, LastVisibleProject2);
        this.props.app.set({
            FirstVisibleProject: FirstVisibleProject2,
            LastVisibleProject: LastVisibleProject2
        }, () => { console.log(this.props.app.FirstVisibleProject, this.props.app.LastVisibleProject); });

        projectList.splice(indx, 1);
        tooltipOpen.splice(indx, 1);
        console.log({ tooltipOpen })
        //tooltipOpen = tooltipOpen.filter((_, i)=> i !== indx)

        this.props.app.set({
            projectList: projectList,
            tooltipOpen: tooltipOpen
        },
            () => {
                let newTabActive = {};
                if (this.props.app.projectList && this.props.app.projectList.length) {
                    if (this.props.app.projectList[indx]) {
                        newTabActive = this.props.app.projectList[indx];
                    } else if (this.props.app.projectList[indx - 1]) {
                        newTabActive = this.props.app.projectList[indx - 1];
                    }
                    this.props.app.set({
                        currentProject: newTabActive
                    });
                }
            });*/
        //se debe cambiar el current project!!
        const { __projectList, set } = this.props.app;
        delete __projectList[project.id];
        set({ __projectList });
    }

    getTabs() {
        const { __projectList } = this.props.app;
        return Object.values(__projectList).map(
            (value, index) =>
                <div key={index} id={value.id} className={classnames('tab', { 'tab-active': this.props.app.currentProject.id === value.id})} data-project={value.id} onClick={()=>{this.handlerToggleProject(value);}}>
                    <div className="tab-label float-left">
                        {value.filename}
                    </div>
                    <Button className='close float-right' onClick={()=>{this.handlerCloseProject(value);}} close />
                </div>
        )
    }

    render() {
        /*
        const TabsCreated = this.props.app.projectListVisible.map((project, indx)=>{
            return (<div key={indx}>
                <NavItem  className='tab'>
                    <NavLink id={project.id} className={classnames(, { active: this.props.app.currentProject.id === project.id})} onClick={()=>{this.handlerToggleProject(project);}}>
                        <span className='tab-label'>{project.filename}</span> <Button className='close' onClick={()=>{this.handlerCloseProject(project);}} close />
                        <Tooltip placement="bottom" isOpen={this.props.app.tooltipOpen[indx]} autohide={false} target={project.id} toggle={()=>{this.toggleTooltip(indx)}}>
                            {project.filename}
                        </Tooltip>
                    </NavLink>
                </NavItem>
            </div>);
            
        });*/
        return (
            <div>
                <Button outline className='float-right add-project' onClick={this.handlerAddProject}>+</Button>
                <div className="project-navegator">
                    {this.getTabs()}
                </div>
            </div>
            
        );
    }
}
export default ProjectNavegator;