import React, {useState}from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './course-card.css';

import api from '../../config/api';
import { isEmpty } from '../../helpers/helper';

function CourseCard(props) {

  const [institutions, setInstitutions] = useState(<></>);

  var start = true;

  function fetch(){
    if(!isEmpty(props.id) && start){
      start = false;
      console.log(props.id)
      api.get('/customization/get-by-course-id?courseId=' + props.id)
      .then((response)=>{
          if(response.data.length > 0){
              setInstitutions(
                  <ul>
                      {response.data.map(
                          (u, i) => (
                              <li key={i}><a href={u.descriptionLink} target="_blank">{u.courseDescriptionCustomization.substring(0,50)}</a></li> 
                          ))}     
                  </ul>
              )
          }
      })
    } 
  }

  return(
    <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible orientation="horizontal" onValueChange={fetch}>
      <Accordion.Item className="AccordionItem" value={"item-3"} type="single">
        <AccordionTrigger>{isEmpty(props.title) ? "" : props.title}</AccordionTrigger>
        <AccordionContent>
          <div>{isEmpty(props.description) ? "" : props.description}</div>
          <div>{institutions}</div>
        </AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  )
};

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={classNames('AccordionTrigger', className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon className="AccordionChevron" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames('AccordionContent', className)}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));

export default CourseCard;