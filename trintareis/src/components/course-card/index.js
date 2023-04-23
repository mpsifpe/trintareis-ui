import './course-card.css';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { isEmpty } from '../../helpers/helper';
import { Link, useLocation } from 'react-router-dom';

function CourseCard(props) {

  const [title, setTitle] = useState("");
  const [description, setDdescription] = useState("");

  useEffect(() => {
    const abortController = new AbortController()

    if (!isEmpty(props.title) && props.title != undefined){ setTitle(props.title)  }
    if (!isEmpty(props.description) && props.description != undefined){ setDdescription(props.description)  }

    //console.log(props)

    return function cleanup() {
        abortController.abort()
    }
},[]);

  return(
    <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible orientation="horizontal">
      <Accordion.Item className="AccordionItem" value={"item-3"} type="single">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div>{description}</div>
          <Link to={{pathname: "/careerDetail/" + props.id,
                      state: {
                        firstLogin: props.stateFirstLogin,
                        profilePhoto: props.stateProfilePhoto,
                        coverPhoto: props.stateCoverPhoto,
                        userData: props.stateUserData,
                        origin: "career",
                        courseID: props.id,
                        courseTitle: title,
                        courseDesc: description }}}>
            <button className="more_button"> <label className='button_label'>SAIBA MAIS</label> </button>
          </Link>
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