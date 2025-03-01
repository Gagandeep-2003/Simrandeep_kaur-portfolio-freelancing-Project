import React from 'react';
import { data } from "../../data/work-data"; 
import "./Projects.css";

const Project = ({ title, subtitle }) => (
  <div className="page14-inner">
    <h1>{title}</h1>
    <div className="center14"></div>
    <span className="subtitle">{subtitle}</span> 
  </div>
);

const ProjectList = () => {
  return (
    <>
      <h2 className="heading-text" id="projects">
        Projects
      </h2>
      <div id="page14">
        {data.map((project) => (
          <Project
            key={project.id}
            title={project.title}
            subtitle={project.subtitle}
          />
        ))}
      </div>
    </>
  );
};

export default ProjectList;
