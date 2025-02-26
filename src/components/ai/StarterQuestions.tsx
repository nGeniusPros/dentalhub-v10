import React from 'react';

const StarterQuestions = () => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800">To use the agent, you can ask questions like:</h2>
      <div className="mt-4 space-y-2">
        <ul className="list-none pl-4 space-y-1">
          <li>Show me the production per hour for last month</li>
          <li>What's our hygiene productivity trend over the past quarter?</li>
          <li>Compare treatment acceptance rates between January and March</li>
          <li>Analyze schedule optimization percentage for Q1 2024</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Data Retrieval Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>Show me last month's production numbers</li>
          <li>Pull up today's schedule</li>
          <li>Get the collection rate for this quarter</li>
          <li>How many new patients did we have this month?</li>
          <li>Show me hygiene production for each hygienist</li>
          <li>What's our current accounts receivable?</li>
          <li>Get me the treatment acceptance rate for Dr. Smith</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Analysis Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>Compare our performance to last year</li>
          <li>Are we meeting our production goals?</li>
          <li>Why is revenue down this month?</li>
          <li>Show me trends in patient cancellations</li>
          <li>Which procedures are most profitable?</li>
          <li>How efficient is our hygiene department?</li>
          <li>What's causing our schedule gaps?</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Recommendation Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>How can we increase production?</li>
          <li>What should we do about cancellations?</li>
          <li>Give me ideas to improve case acceptance</li>
          <li>Help me optimize the schedule</li>
          <li>How can we reduce no-shows?</li>
          <li>What's the best way to handle insurance delays?</li>
          <li>How can we grow our new patient numbers?</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Coaching Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>Create training for treatment presentation</li>
          <li>Help me coach the front desk on scheduling</li>
          <li>Give me talking points for the morning huddle</li>
          <li>How should we implement these changes?</li>
          <li>Train my team on handling payment discussions</li>
          <li>Create a guide for insurance verification</li>
          <li>Help me motivate my hygiene team</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Profitability Scheduling Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>What's the most profitable way to schedule next week?</li>
          <li>Help me fill tomorrow's openings</li>
          <li>How should I organize the hygiene schedule?</li>
          <li>Optimize Dr. Johnson's column</li>
          <li>What procedures should we prioritize?</li>
          <li>Balance the workload between providers</li>
          <li>Find the best time for a crown prep</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Common Combination Requests:</h2>
        <ul className="list-none pl-4 space-y-1">
          <li>The schedule is empty next week - what should we do?</li>
          <li>Production is down - analyze the issue and tell me how to fix it</li>
          <li>We're not meeting goals - give me a complete plan to improve</li>
          <li>Help me make this month more profitable</li>
          <li>Our hygiene department is struggling - analyze and create a solution</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Quick Questions</h2>
        <ul className="list-none pl-4 space-y-1">
            <li>What are the key metrics for growth?</li>
            <li>How to increase case acceptance?</li>
            <li>Best marketing strategies?</li>
            <li>Building referral programs?</li>
            <li>Improving satisfaction scores?</li>
            <li>Reducing wait times?</li>
            <li>Handling complaints?</li>
            <li>Better waiting room experience?</li>
            <li>Optimizing scheduling?</li>
            <li>Reducing no-shows?</li>
            <li>Front desk efficiency?</li>
            <li>Inventory management?</li>
            <li>Improving retention?</li>
            <li>Training new staff?</li>
            <li>Team meetings?</li>
            <li>Performance reviews?</li>
            <li>Increasing revenue?</li>
            <li>Insurance collections?</li>
            <li>Membership programs?</li>
            <li>Fee scheduling?</li>
        </ul>
      </div>
    </div>
  );
};

export default StarterQuestions;