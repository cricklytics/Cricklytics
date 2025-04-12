import React, { useState, useEffect } from 'react';
import '../../styles/SelectionCriteria.css';
import Frame1321317519 from './Frame';

const SelectionCriteria = () => {
  const [openCategory, setOpenCategory] = useState(null); // Track which category is open


  const criteriaData = [
    {
      title: 'Overview',
      description: (
        <>
          <p className="section-text">
            The selection of Cricklytics Kudos* is based on a combination of fan votes and category-specific performance metrics. Players are evaluated across five categories: Popularity, Batting, Bowling, Fielding, and All Rounder. Below, we detail the criteria used for each category to determine the top three winners.
          </p>
        </>
      ),
    },
    {
      title: 'Popularity Category',
      description: (
        <>
          <p className="section-text">
            The Popularity category showcases the three players with the highest number of fan votes across all categories. This is determined by:
          </p>
          <ul className="criteria-list">
            <li>Collecting votes from all nominated players, regardless of their primary category</li>
            <li>Ranking all players based on total votes received</li>
            <li>Selecting the top three players with the highest vote counts</li>
          </ul>
          <p className="section-text">
            Note: Players selected in the Popularity category may also appear in their respective performance-based categories if they rank among the top three there.
          </p>
        </>
      ),
    },
    {
      title: 'Batting Category',
      description: (
        <>
          <p className="section-text">
            Winners in the Batting category are selected based on their voting performance within the batting nominees. The process includes:
          </p>
          <ul className="criteria-list">
            <li>Compiling a list of players nominated specifically for batting</li>
            <li>Ranking them by the number of votes received</li>
            <li>Selecting the top three batters with the highest votes</li>
          </ul>
          <p className="section-text">
            Key stats displayed: Runs, Batting Average, and Strike Rate.
          </p>
        </>
      ),
    },
    {
      title: 'Bowling Category',
      description: (
        <>
          <p className="section-text">
            The Bowling category winners are determined by:
          </p>
          <ul className="criteria-list">
            <li>Listing all players nominated for bowling</li>
            <li>Sorting them by vote count</li>
            <li>Choosing the top three bowlers with the most votes</li>
          </ul>
          <p className="section-text">
            Key stats displayed: Wickets, Bowling Average, and Economy Rate.
          </p>
        </>
      ),
    },
    {
      title: 'Fielding Category',
      description: (
        <>
          <p className="section-text">
            Fielding winners are selected through:
          </p>
          <ul className="criteria-list">
            <li>Gathering all fielding nominees</li>
            <li>Ranking them based on votes received</li>
            <li>Picking the top three fielders with the highest votes</li>
          </ul>
          <p className="section-text">
            Key stats displayed: Matches, Catches, and Run Outs.
          </p>
        </>
      ),
    },
    {
      title: 'All Rounder Category',
      description: (
        <>
          <p className="section-text">
            All Rounder winners are chosen by:
          </p>
          <ul className="criteria-list">
            <li>Compiling a list of all-rounder nominees</li>
            <li>Ordering them by vote totals</li>
            <li>Selecting the top three all-rounders with the most votes</li>
          </ul>
          <p className="section-text">
            Key stats displayed: Runs, Batting Average, Strike Rate, Wickets, Bowling Average, and Economy Rate.
          </p>
        </>
      ),
    },
    {
      title: 'Additional Notes',
      description: (
        <>
          <ul className="criteria-list" color='white'>
            <li>Each performance category (Batting, Bowling, Fielding, All Rounder) is limited to exactly three winners</li>
            <li>Votes are only displayed for the Popularity category to emphasize fan choice</li>
            <li>Performance stats are shown for all categories to provide context, but winners are determined solely by votes</li>
            <li>Players may appear in multiple categories if they qualify for both Popularity and their performance category</li>
          </ul>
        </>
      ),
    },
  ];

  const toggleCategory = (categoryTitle) => {
    setOpenCategory(openCategory === categoryTitle ? null : categoryTitle);
  };

  return (
    <div className="selection-criteria-container">
      <Frame1321317519 />
      <div className="selection-criteria-content">
        <h1 className="page-title">Selection Criteria for Winners</h1>

        <div className="criteria-dropdowns">
          {criteriaData.map((criteria) => (
            <div key={criteria.title} className="dropdown-item">
              <button
                className="dropdown-button"
                onClick={() => toggleCategory(criteria.title)}
              >
                {criteria.title}
                <span className="dropdown-arrow">
                  {openCategory === criteria.title ? '▲' : '▼'}
                </span>
              </button>
              {openCategory === criteria.title && (
                <div className="dropdown-content">
                  {criteria.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionCriteria;