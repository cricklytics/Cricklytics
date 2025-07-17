import React, { useState, useEffect, Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderComponent from '../../components/kumar/startMatchHeader';
import backButton from '../../assets/kumar/right-chevron.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, increment, setDoc, Timestamp } from 'firebase/firestore';
import sixAnimation from '../../assets/Animation/six.json';
import fourAnimation from '../../assets/Animation/four.json';
import outAnimation from '../../assets/Animation/out.json';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-white text-center p-4">
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function StartMatchPlayersRoundRobin({ initialTeamA, initialTeamB, origin }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract all relevant data from location.state
  const originPage = location.state?.origin;
  const maxOvers = location.state?.overs;
  const teamA = location.state?.teamA;
  const teamB = location.state?.teamB;
  const tournamentId = location.state?.tournamentId;
  const matchId = location.state?.matchId;
  const phase = location.state?.phase;
  const selectedPlayersFromProps = location.state?.selectedPlayers || { left: [], right: [] };
  const tournamentName = location.state?.tournamentName;

  // Wagon Wheel State
  const [showWagonWheel, setShowWagonWheel] = useState(false);
  const [showShotTypeModal, setShowShotTypeModal] = useState(false);
  const [showTrajectoryModal, setShowTrajectoryModal] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [selectedShotType, setSelectedShotType] = useState(null);
  const [selectedTrajectory, setSelectedTrajectory] = useState(null);
  const [ballAnimation, setBallAnimation] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);

  // Shot directions with angles and positions
  const SHOT_DIRECTIONS = [
    { label: "Straight", angle: 0, position: "long-on/long-off", color: "#2196F3" },
    { label: "Cover", angle: 45, position: "extra cover", color: "#2196F3" },
    { label: "Mid-Wicket", angle: 135, position: "mid-wicket", color: "#2196F3" },
    { label: "Square Leg", angle: 180, position: "square leg", color: "#2196F3" },
    { label: "Fine Leg", angle: 225, position: "fine leg", color: "#2196F3" },
    { label: "Third Man", angle: 315, position: "third man", color: "#2196F3" },
    { label: "Point", angle: 270, position: "point", color: "#2196F3" },
    { label: "Long Off", angle: 90, position: "long-off", color: "#2196F3" }
  ];

  // Detailed shot types
  const SHOT_TYPES = [
    { name: "Cover Drive", class: "drive", color: "#009688" },
    { name: "Pull Shot", class: "pull", color: "#009688" },
    { name: "Hook Shot", class: "hook", color: "#009688" },
    { name: "Lofted Shot", class: "loft", color: "#009688" },
    { name: "Straight Drive", class: "drive", color: "#009688" },
    { name: "Square Cut", class: "cut", color: "#009688" },
    { name: "Sweep Shot", class: "sweep", color: "#009688" },
    { name: "Flick Shot", class: "flick", color: "#009688" },
    { name: "Defensive", class: "defense", color: "#009688" },
    { name: "Reverse Sweep", class: "sweep", color: "#009688" }
  ];

  // Ball trajectories
  const TRAJECTORIES = [
    { name: "Flat", color: "#FF9800" },
    { name: "Lofted", color: "#FF9800" },
    { name: "Ground", color: "#FF9800" },
    { name: "Skier", color: "#FF9800" },
    { name: "Bouncer", color: "#FF9800" },
    { name: "Full toss", color: "#FF9800" }
  ];

  // Original match state
  const [playedOvers, setPlayedOvers] = useState(0);
  const [playedWickets, setPlayedWickets] = useState(0);
  const [currentView, setCurrentView] = useState('toss');
  const [showThirdButtonOnly, setShowThirdButtonOnly] = useState(false);
  const [viewHistory, setViewHistory] = useState(['toss']);
  const [topPlays, setTopPlays] = useState([]);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [pastOvers, setPastOvers] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [outCount, setOutCount] = useState(0);
  const [opponentBallsFaced, setOpponentBallsFaced] = useState(0);
  const [validBalls, setValidBalls] = useState(0);
  const [overNumber, setOverNumber] = useState(1);
  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowlerVisible, setBowlerVisible] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [nextBatsmanIndex, setNextBatsmanIndex] = useState(null);
  const [showPastOvers, setShowPastOvers] = useState(false);
  const [selectedBatsmenIndices, setSelectedBatsmenIndices] = useState([]);
  const [isChasing, setIsChasing] = useState(false);
  const [targetScore, setTargetScore] = useState(0);
  const [batsmenScores, setBatsmenScores] = useState({});
  const [batsmenBalls, setBatsmenBalls] = useState({});
  const [batsmenStats, setBatsmenStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});
  const [wicketOvers, setWicketOvers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [gameFinished, setGameFinished] = useState(false);
  const [pendingWide, setPendingWide] = useState(false);
  const [pendingNoBall, setPendingNoBall] = useState(false);
  const [pendingOut, setPendingOut] = useState(false);
  const [activeLabel, setActiveLabel] = useState(null);
  const [activeNumber, setActiveNumber] = useState(null);
  const [showRunInfo, setShowRunInfo] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState(null);
  const [pendingLegBy, setPendingLegBy] = useState(false);
  const [firstInningsData, setFirstInningsData] = useState(null);

  // Dynamic player data
  const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);

  useEffect(() => {
    console.log('Selected Match:', { matchId, phase });
    console.log('Tournament ID:', tournamentId);
    console.log('Tournament Name:', tournamentName);

    if (!teamA || !teamB || !selectedPlayersFromProps.left || !selectedPlayersFromProps.right || !tournamentId || !matchId || !phase) {
      console.error("Missing match data in location state. Redirecting.");
      navigate('/');
      return;
    }

    if (!isChasing) {
      setBattingTeamPlayers(selectedPlayersFromProps.left.map((player, index) => ({
        ...player,
        index: player.name + index,
        photoUrl: player.photoUrl
      })));
      setBowlingTeamPlayers(selectedPlayersFromProps.right.map((player, index) => ({
        ...player,
        index: player.name + index,
        photoUrl: player.photoUrl
      })));
    } else {
      setBattingTeamPlayers(selectedPlayersFromProps.right.map((player, index) => ({
        ...player,
        index: player.name + index,
        photoUrl: player.photoUrl
      })));
      setBowlingTeamPlayers(selectedPlayersFromProps.left.map((player, index) => ({
        ...player,
        index: player.name + index,
        photoUrl: player.photoUrl
      })));
    }
    
    setStriker(null);
    setNonStriker(null);
    setSelectedBowler(null);
    setSelectedBatsmenIndices([]);
    setBatsmenScores({});
    setBatsmenBalls({});
    setBatsmenStats({});
    setBowlerStats({});
    setWicketOvers([]);
  }, [isChasing, selectedPlayersFromProps, teamA, teamB, navigate, tournamentId, matchId, phase]);

  // Wagon Wheel Functions
  const handleDirectionSelect = (direction) => {
    setSelectedDirection(direction);
    setAnimationDirection(direction);
    setBallAnimation(true);
    
    setTimeout(() => {
      setBallAnimation(false);
      setShowWagonWheel(false);
      setShowShotTypeModal(true);
    }, 800);
  };

  const handleShotTypeSelect = (shotType) => {
    setSelectedShotType(shotType);
    setShowShotTypeModal(false);
    setShowTrajectoryModal(true);
  };

  const handleTrajectorySelect = (trajectory) => {
    setSelectedTrajectory(trajectory);
    setShowTrajectoryModal(false);
    
    // Process the ball with all selected data
    processBallWithWagonWheelData();
  };

  const processBallWithWagonWheelData = () => {
    const isWicket = selectedRun === 'W';
    
    const ballData = {
      inning: isChasing ? 2 : 1,
      over: overNumber - 1,
      ball: validBalls + 1,
      runs: isWicket ? 0 : selectedRun,
      shotDirection: selectedDirection?.label || '',
      shotPosition: selectedDirection?.position || '',
      shotType: selectedShotType?.name || '',
      ballTrajectory: selectedTrajectory?.name || '',
      wicketType: isWicket ? 'catch' : '',
      timestamp: new Date().toISOString()
    };

    // Update score
    if (!isWicket) {
      setPlayerScore(prev => prev + selectedRun);
      setTopPlays(prev => [...prev, selectedRun]);
      setCurrentOverBalls(prev => [...prev, selectedRun]);
      
      if (striker) {
        updateBatsmanScore(striker.index, selectedRun);
        updateBatsmanStats(striker.index, selectedRun, selectedRun === 0);
        updateBatsmanBalls(striker.index);
      }
    }

    // Update bowler stats
    if (selectedBowler) {
      updateBowlerStats(selectedBowler.index, isWicket, true, isWicket ? 0 : selectedRun);
    }

    // Handle odd runs (striker change)
    if (!isWicket && selectedRun % 2 !== 0) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }

    // Reset wagon wheel selections
    setSelectedDirection(null);
    setSelectedShotType(null);
    setSelectedTrajectory(null);
    setSelectedRun(null);

    // Update valid balls count
    setValidBalls(prev => prev + 1);

    // Save match data
    saveMatchData();
  };

  const renderWagonWheel = () => {
    return (
      <div className="relative w-[350px] h-[350px] mx-auto my-4">
        {/* Cricket field background */}
        <div className="absolute inset-0 bg-green-800 rounded-full border-4 border-green-600 flex items-center justify-center overflow-hidden">
          {/* Pitch */}
          <div className="absolute w-12 h-4 bg-brown-800 transform rotate-90"></div>
          
          {/* Field markings */}
          <div className="absolute w-full h-full rounded-full border-2 border-green-500 border-opacity-50"></div>
          <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-green-500 border-opacity-50"></div>
          <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-green-500 border-opacity-50"></div>
          
          {/* Current ball animation */}
          {ballAnimation && (
            <div 
              className={`absolute z-20 w-6 h-6 bg-white rounded-full shadow-xl animate-ball-flight`}
              style={{
                '--direction-angle': `${animationDirection.angle}deg`,
                '--distance': selectedRun === 6 ? '150px' : 
                              selectedRun === 4 ? '120px' : 
                              '80px'
              }}
            >
              <div className="absolute -top-5 -left-5 w-10 text-center text-xs font-bold text-white bg-black bg-opacity-70 rounded-full p-1">
                {selectedRun}
              </div>
            </div>
          )}
          
          {/* Direction buttons */}
          {SHOT_DIRECTIONS.map((dir) => (
            <button
              key={dir.label}
              onClick={() => handleDirectionSelect(dir)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 
                px-3 py-2 rounded-md text-white font-bold text-xs
                transition-all duration-200 shadow hover:shadow-md
                flex items-center justify-center min-w-[80px] hover:scale-105 z-10`}
              style={{
                top: `${50 - Math.sin(dir.angle * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(dir.angle * Math.PI / 180) * 40}%`,
                backgroundColor: dir.color
              }}
            >
              {dir.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const displayModal = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  const handleButtonClick = (view) => {
    setCurrentView(view);
    setShowThirdButtonOnly(view === 'start');
    setViewHistory(prev => [...prev, view]);
  };

  const goBack = () => {
    if (gameFinished && showModal) {
      return;
    }

    if (showBowlerDropdown) {
      setShowBowlerDropdown(false);
      return;
    }
    if (showBatsmanDropdown) {
      cancelBatsmanDropdown();
      return;
    }

    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
      setShowThirdButtonOnly(previousView === 'start');
      
      if (previousView === 'toss') {
        setBowlerVisible(false);
        setSelectedBowler(null);
      }
    } else {
      navigate(-1);
    }
  };

  const updateBatsmanScore = (batsmanIndex, runs) => {
    setBatsmenScores(prev => ({
      ...prev,
      [batsmanIndex]: (prev[batsmanIndex] || 0) + runs
    }));
  };

  const updateBatsmanBalls = (batsmanIndex) => {
    setBatsmenBalls(prev => ({
      ...prev,
      [batsmanIndex]: (prev[batsmanIndex] || 0) + 1
    }));
  };

  const updateBatsmanStats = (batsmanIndex, runs, isDotBall = false) => {
    setBatsmenStats(prev => {
      const currentStats = prev[batsmanIndex] || {
        runs: 0,
        balls: 0,
        dotBalls: 0,
        ones: 0,
        twos: 0,
        threes: 0,
        fours: 0,
        sixes: 0,
        milestone: null
      };
      
      const newRuns = currentStats.runs + runs;
      let milestone = currentStats.milestone;
      if (newRuns >= 100 && currentStats.runs < 100) milestone = 100;
      else if (newRuns >= 50 && currentStats.runs < 50) milestone = 50;

      return {
        ...prev,
        [batsmanIndex]: {
          ...currentStats,
          runs: newRuns,
          balls: currentStats.balls + (isDotBall || runs > 0 ? 1 : 0),
          dotBalls: isDotBall ? currentStats.dotBalls + 1 : currentStats.dotBalls,
          ones: runs === 1 ? currentStats.ones + 1 : currentStats.ones,
          twos: runs === 2 ? currentStats.twos + 1 : currentStats.twos,
          threes: runs === 3 ? currentStats.threes + 1 : currentStats.threes,
          fours: runs === 4 ? currentStats.fours + 1 : currentStats.fours,
          sixes: runs === 6 ? currentStats.sixes + 1 : currentStats.sixes,
          milestone
        }
      };
    });
  };

  const updateBowlerStats = (bowlerIndex, isWicket = false, isValidBall = false, runsConceded = 0) => {
    setBowlerStats(prev => {
      const currentBowler = prev[bowlerIndex] || { wickets: 0, ballsBowled: 0, oversBowled: '0.0', runsConceded: 0 };
      const ballsBowled = currentBowler.ballsBowled + (isValidBall ? 1 : 0);
      const overs = Math.floor(ballsBowled / 6) + (ballsBowled % 6) / 10;
      return {
        ...prev,
        [bowlerIndex]: {
          wickets: isWicket ? (currentBowler.wickets || 0) + 1 : currentBowler.wickets || 0,
          ballsBowled,
          oversBowled: overs.toFixed(1),
          runsConceded: (currentBowler.runsConceded || 0) + runsConceded
        }
      };
    });
  };

  const recordWicket = (batsmanIndex) => {
    const currentOver = `${overNumber - 1}.${validBalls + 1}`;
    setWicketOvers(prev => [...prev, { batsmanIndex, over: currentOver }]);
  };

  const playAnimation = (type) => {
    setAnimationType(type);
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
  };

  const saveMatchData = async (isFinal = false) => {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found.');
        return;
      }

      const overs = `${overNumber - 1}.${validBalls}`;
      const battingTeam = isChasing ? teamB : teamA;
      const bowlingTeam = isChasing ? teamA : teamB;

      const playerStats = battingTeamPlayers.map(player => {
        const stats = batsmenStats[player.index] || {};
        const wicket = wicketOvers.find(w => w.batsmanIndex === player.index);
        return {
          index: player.index || '',
          name: player.name || 'Unknown',
          photoUrl: player.photoUrl || '',
          role: player.role || '',
          runs: stats.runs || 0,
          balls: stats.balls || 0,
          dotBalls: stats.dotBalls || 0,
          ones: stats.ones || 0,
          twos: stats.twos || 0,
          threes: stats.threes || 0,
          fours: stats.fours || 0,
          sixes: stats.sixes || 0,
          milestone: stats.milestone || null,
          wicketOver: wicket ? wicket.over : null
        };
      });

      const bowlerStatsArray = bowlingTeamPlayers.map(player => {
        const stats = bowlerStats[player.index] || {};
        return {
          index: player.index || '',
          name: player.name || 'Unknown',
          photoUrl: player.photoUrl || '',
          role: player.role || '',
          wickets: stats.wickets || 0,
          oversBowled: stats.oversBowled || '0.0',
          runsConceded: stats.runsConceded || 0
        };
      });

      const matchData = {
        matchId,
        tournamentId,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.fromDate(new Date()),
        tournamentName: 'Round Robin',
        umpire: 'naga',
        phase: phase || 'Unknown',
        Format: maxOvers,
        teamA: {
          name: teamA?.name || 'Team A',
          flagUrl: teamA?.flagUrl || '',
          players: selectedPlayersFromProps.left.map(p => ({
            name: p.name || 'Unknown',
            index: p.name + selectedPlayersFromProps.left.findIndex(pl => pl.name === p.name),
            photoUrl: p.photoUrl || '',
            role: p.role || ''
          })),
          totalScore: isChasing ? (firstInningsData?.totalScore || 0) : playerScore,
          wickets: isChasing ? (firstInningsData?.wickets || 0) : outCount,
          overs: isChasing ? (firstInningsData?.overs || '0.0') : overs,
          result: isFinal ? (playerScore < targetScore - 1 ? 'Win' : playerScore === targetScore - 1 ? 'Tie' : 'Loss') : null
        },
        teamB: {
          name: teamB?.name || 'Team B',
          flagUrl: teamB?.flagUrl || '',
          players: selectedPlayersFromProps.right.map(p => ({
            name: p.name || 'Unknown',
            index: p.name + selectedPlayersFromProps.right.findIndex(pl => pl.name === p.name),
            photoUrl: p.photoUrl || '',
            role: p.role || ''
          })),
          totalScore: isChasing ? playerScore : (firstInningsData?.totalScore || 0),
          wickets: isChasing ? outCount : (firstInningsData?.wickets || 0),
          overs: isChasing ? overs : (firstInningsData?.overs || '0.0'),
          result: isFinal ? (playerScore < targetScore - 1 ? 'Loss' : playerScore === targetScore - 1 ? 'Tie' : 'Win') : null
        },
        firstInnings: firstInningsData || {
          teamName: teamA?.name || 'Team A',
          totalScore: playerScore,
          wickets: outCount,
          overs,
          playerStats,
          bowlerStats: bowlerStatsArray
        },
        secondInnings: isChasing ? {
          teamName: teamB?.name || 'Team B',
          totalScore: playerScore,
          wickets: outCount,
          overs,
          playerStats,
          bowlerStats: bowlerStatsArray
        } : null,
        matchResult: isFinal ? (playerScore < targetScore - 1 ? teamA?.name || 'Team A' : playerScore === targetScore - 1 ? 'Tie' : teamB?.name || 'Team B') : null
      };
      const docId = `${tournamentId}_${matchId}`;
      await setDoc(doc(db, 'scoringpage', docId), matchData);
      console.log('Match data updated successfully:', matchData);
    } catch (error) {
      console.error('Error saving match data:', error);
    }
  };

  const handleScoreButtonClick = (value, isLabel) => {
    if (gameFinished) return;

    let runsToAdd = 0;
    let isValidBall = false;

    if (isLabel) {
      setActiveNumber(null);
      setActiveLabel(value);
    } else {
      setActiveLabel(null);
      setActiveNumber(value);
    }

    // Handle pending actions first
    if (pendingWide && !isLabel && typeof value === 'number') {
      runsToAdd = value + 1;
      setPlayerScore(prev => prev + runsToAdd);
      setTopPlays(prev => [...prev, `W+${value}`]);
      setCurrentOverBalls(prev => [...prev, `W+${value}`]);
      if (striker) {
        updateBatsmanScore(striker.index, value + 1);
        updateBatsmanStats(striker.index, value + 1);
      }
      if (selectedBowler) updateBowlerStats(selectedBowler.index, false, false, runsToAdd);
      setPendingWide(false);
      saveMatchData();
      return;
    }

    if (pendingNoBall && !isLabel && typeof value === 'number') {
      runsToAdd = value + 1;
      setPlayerScore(prev => prev + runsToAdd);
      setTopPlays(prev => [...prev, `NB+${value}`]);
      setCurrentOverBalls(prev => [...prev, `NB+${value}`]);
      if (striker) {
        updateBatsmanScore(striker.index, value + 1);
        updateBatsmanStats(striker.index, value + 1);
      }
      if (selectedBowler) updateBowlerStats(selectedBowler.index, false, false, runsToAdd);
      setPendingNoBall(false);
      saveMatchData();
      return;
    }

    if (pendingLegBy && !isLabel && typeof value === 'number') {
      runsToAdd = value;
      setPlayerScore(prev => prev + runsToAdd);
      setTopPlays(prev => [...prev, `L+${value}`]);
      setCurrentOverBalls(prev => [...prev, `L+${value}`]);
      setValidBalls(prev => prev + 1);
      isValidBall = true;
      if (striker) updateBatsmanBalls(striker.index);
      if (selectedBowler) updateBowlerStats(selectedBowler.index, false, true, runsToAdd);
      if (value % 2 !== 0) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
      setPendingLegBy(false);
      saveMatchData();
      return;
    }

    if (pendingOut && !isLabel && typeof value === 'number') {
      if (value !== 0 && value !== 1 && value !== 2) {
        return;
      }
      playAnimation('out');
      setTimeout(() => {
        runsToAdd = value;
        setPlayerScore(prev => prev + runsToAdd);
        setTopPlays(prev => [...prev, `O+${value}`]);
        setCurrentOverBalls(prev => [...prev, `O+${value}`]);
        if (striker) {
          updateBatsmanScore(striker.index, value);
          updateBatsmanStats(striker.index, value, value === 0);
          updateBatsmanBalls(striker.index);
          recordWicket(striker.index);
        }
        setValidBalls(prev => prev + 1);
        isValidBall = true;
        if (selectedBowler) updateBowlerStats(selectedBowler.index, true, true, runsToAdd);
        setShowBatsmanDropdown(true);
        saveMatchData();
      }, 3000);
      setPendingOut(false);
      return;
    }

    // Handle regular runs with animations
    if (!isLabel) {
      setSelectedRun(value);
      
      if (value === 6) {
        playAnimation('six');
        setTimeout(() => {
          setShowWagonWheel(true);
        }, 3000);
        return;
      } else if (value === 4) {
        playAnimation('four');
        setTimeout(() => {
          setShowWagonWheel(true);
        }, 3000);
        return;
      } else {
        setShowWagonWheel(true);
      }
    }

    const extraBalls = ['No-ball', 'Wide', 'No ball'];
    const playValue = typeof value === 'string' ? value.charAt(0) : value;

    if (isLabel) {
      if (value === 'Wide' || value === 'No-ball' || value === 'Leg By' || value === 'OUT') {
        setShowRunInfo(true);
      } else {
        setShowRunInfo(false);
      }

      if (value === 'Six') {
        playAnimation('six');
        setSelectedRun(6);
        setTimeout(() => {
          setShowWagonWheel(true);
        }, 3000);
      } else if (value === 'Four') {
        playAnimation('four');
        setSelectedRun(4);
        setTimeout(() => {
          setShowWagonWheel(true);
        }, 3000);
      } else if (value === 'Wide') {
        setPendingWide(true);
        return;
      } else if (value === 'No-ball') {
        setPendingNoBall(true);
        return;
      } else if (value === 'Leg By') {
        setPendingLegBy(true);
        return;
      } else if (value === 'OUT' || value === 'Wicket' || value === 'lbw') {
        setPendingOut(true);
        return;
      }

      if (!extraBalls.includes(value)) {
        setValidBalls(prev => prev + 1);
        if (striker && value !== 'Wide' && value !== 'No-ball') {
          updateBatsmanBalls(striker.index);
        }
        saveMatchData();
      }
    }
  };

  useEffect(() => {
    if (modalContent.title !== 'Match Result') return;

    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let fireworks = [];

    function randomColor() {
      return `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
    }

    function createFirework(x, y) {
      const color = randomColor();
      const particles = [];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 1 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2 + 0.5,
        });
      }

      fireworks.push({ particles });
    }

    function launch() {
      createFirework(width / 2, height / 3);
      createFirework(width / 4, height / 1.8);
      createFirework((3 * width) / 4, height / 1.8);
    }

    const interval = setInterval(launch, 1500);
    update();

    function update() {
      ctx.clearRect(0, 0, width, height);

      fireworks.forEach(firework => {
        firework.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.005;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        firework.particles = firework.particles.filter(p => p.alpha > 0);
      });

      fireworks = fireworks.filter(f => f.particles.length > 0);
      ctx.globalAlpha = 1;
      requestAnimationFrame(update);
    }

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
      fireworks = [];
      ctx.clearRect(0, 0, width, height);
    };
  }, [modalContent.title]);

  useEffect(() => {
    if (gameFinished) {
      saveMatchData(true);
      return;
    }

    if (outCount >= 10 || (validBalls === 6 && overNumber > maxOvers - 1)) {
      if (!isChasing) {
        const overs = `${overNumber - 1}.${validBalls}`;
        const playerStats = battingTeamPlayers.map(player => {
          const stats = batsmenStats[player.index] || {};
          const wicket = wicketOvers.find(w => w.batsmanIndex === player.index);
          return {
            index: player.index || '',
            name: player.name || 'Unknown',
            photoUrl: player.photoUrl || '',
            role: player.role || '',
            runs: stats.runs || 0,
            balls: stats.balls || 0,
            dotBalls: stats.dotBalls || 0,
            ones: stats.ones || 0,
            twos: stats.twos || 0,
            threes: stats.threes || 0,
            fours: stats.fours || 0,
            sixes: stats.sixes || 0,
            milestone: stats.milestone || null,
            wicketOver: wicket ? wicket.over : null
          };
        });
        const bowlerStatsArray = bowlingTeamPlayers.map(player => {
          const stats = bowlerStats[player.index] || {};
          return {
            index: player.index || '',
            name: player.name || 'Unknown',
            photoUrl: player.photoUrl || '',
            role: player.role || '',
            wickets: stats.wickets || 0,
            oversBowled: stats.oversBowled || '0.0',
            runsConceded: stats.runsConceded || 0
          };
        });
        setFirstInningsData({
          teamName: teamA?.name || 'Team A',
          totalScore: playerScore,
          wickets: outCount,
          overs,
          playerStats,
          bowlerStats: bowlerStatsArray
        });
        setTargetScore(playerScore + 1);
        setIsChasing(true);
        resetInnings();
        setViewHistory(['toss']);
        saveMatchData();
        displayModal('Innings Break', `You need to chase ${playerScore + 1} runs`);
      } else {
        let winnerTeamName = '';
        if (playerScore < targetScore - 1) {
          winnerTeamName = teamA.name;
          displayModal('Match Result', `${teamA.name} wins by ${targetScore - 1 - playerScore} runs!`);
          setGameFinished(true);
        } else if (playerScore === targetScore - 1) {
          winnerTeamName = 'Tie';
          displayModal('Match Result', 'Match tied!');
          setGameFinished(true);
        } else {
          winnerTeamName = teamB.name;
          displayModal('Match Result', `${teamB.name} wins by ${10 - outCount} wickets!`);
          setGameFinished(true);
        }
        saveMatchData(true);
      }
      return;
    }

    if (isChasing && playerScore >= targetScore && targetScore > 0) {
      displayModal('Match Result', `${teamB.name} wins by ${10 - outCount} wickets!`);
      setGameFinished(true);
      saveMatchData(true);
      return;
    }

    if (validBalls === 6) {
      setPastOvers(prev => [...prev, currentOverBalls]);
      setCurrentOverBalls([]);
      setOverNumber(prev => prev + 1);
      setValidBalls(0);
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
      displayModal('Over Finished', `Over ${overNumber} completed!`);
      setTimeout(() => {
        setShowBowlerDropdown(true);
      }, 1000);
      saveMatchData();
    }
  }, [validBalls, currentOverBalls, nonStriker, overNumber, isChasing, targetScore, playerScore, gameFinished, outCount, maxOvers, teamA, teamB, playedOvers, playedWickets]);

  const resetInnings = () => {
    setCurrentOverBalls([]);
    setPastOvers([]);
    setPlayerScore(0);
    setOutCount(0);
    setValidBalls(0);
    setOverNumber(1);
    setStriker(null);
    setNonStriker(null);
    setSelectedBowler(null);
    setSelectedBatsmenIndices([]);
    setTopPlays([]);
    setBowlerVisible(false);
    setCurrentView('toss');
    setShowThirdButtonOnly(false);
    setViewHistory(['toss']);
    setBatsmenScores({});
    setBatsmenBalls({});
    setBatsmenStats({});
    setBowlerStats({});
    setWicketOvers([]);
    setGameFinished(false);
    setPendingWide(false);
    setPendingNoBall(false);
    setPendingOut(false);
    setPendingLegBy(false);
    setActiveLabel(null);
    setActiveNumber(null);
    setShowRunInfo(false);
  };

  const resetGame = () => {
    resetInnings();
    setIsChasing(false);
    setTargetScore(0);
    setViewHistory(['toss']);
  };

  const getStrikeRate = (batsmanIndex) => {
    const runs = batsmenScores[batsmanIndex] || 0;
    const balls = batsmenBalls[batsmanIndex] || 0;
    if (balls === 0) return 0;
    return ((runs / balls) * 100).toFixed(2);
  };

  const handlePlayerSelect = (player) => {
    if (!striker) {
      setStriker(player);
      setSelectedBatsmenIndices(prev => [...prev, player.index]);
      setBatsmenScores(prev => ({ ...prev, [player.index]: 0 }));
      setBatsmenBalls(prev => ({ ...prev, [player.index]: 0 }));
      setBatsmenStats(prev => ({
        ...prev,
        [player.index]: {
          runs: 0,
          balls: 0,
          dotBalls: 0,
          ones: 0,
          twos: 0,
          threes: 0,
          fours: 0,
          sixes: 0,
          milestone: null
        }
      }));
    } else if (!nonStriker && striker.index !== player.index) {
      setNonStriker(player);
      setSelectedBatsmenIndices(prev => [...prev, player.index]);
      setBatsmenScores(prev => ({ ...prev, [player.index]: 0 }));
      setBatsmenBalls(prev => ({ ...prev, [player.index]: 0 }));
      setBatsmenStats(prev => ({
        ...prev,
        [player.index]: {
          runs: 0,
          balls: 0,
          dotBalls: 0,
          ones: 0,
          twos: 0,
          threes: 0,
          fours: 0,
          sixes: 0,
          milestone: null
        }
      }));
    }
    saveMatchData();
  };

  const handleBowlerSelect = (player) => {
    setSelectedBowler(player);
    setBowlerStats(prev => ({
      ...prev,
      [player.index]: {
        wickets: prev[player.index]?.wickets || 0,
        ballsBowled: prev[player.index]?.ballsBowled || 0,
        oversBowled: prev[player.index]?.oversBowled || '0.0',
        runsConceded: prev[player.index]?.runsConceded || 0
      }
    }));
    setShowBowlerDropdown(false);
    saveMatchData();
  };

  const handleBatsmanSelect = (player) => {
    setStriker(player);
    setSelectedBatsmenIndices(prev => [...prev, player.index]);
    setShowBatsmanDropdown(false);
    setBatsmenScores(prev => ({ ...prev, [player.index]: 0 }));
    setBatsmenBalls(prev => ({ ...prev, [player.index]: 0 }));
    setBatsmenStats(prev => ({
      ...prev,
      [player.index]: {
        runs: 0,
        balls: 0,
        dotBalls: 0,
        ones: 0,
        twos: 0,
        threes: 0,
        fours: 0,
        sixes: 0,
        milestone: null
      }
    }));
    setOutCount(prev => prev + 1);
    saveMatchData();
  };

  const getAvailableBatsmen = () => {
    return battingTeamPlayers.filter(player =>
      !selectedBatsmenIndices.includes(player.index)
    );
  };

  const cancelStriker = () => {
    setSelectedBatsmenIndices(prev => prev.filter(i => i !== striker?.index));
    const newScores = { ...batsmenScores };
    delete newScores[striker?.index];
    setBatsmenScores(newScores);
    const newBalls = { ...batsmenBalls };
    delete newBalls[striker?.index];
    setBatsmenBalls(newBalls);
    const newStats = { ...batsmenStats };
    delete newStats[striker?.index];
    setBatsmenStats(newStats);
    setStriker(null);
    saveMatchData();
  };

  const cancelNonStriker = () => {
    setSelectedBatsmenIndices(prev => prev.filter(i => i !== nonStriker?.index));
    const newScores = { ...batsmenScores };
    delete newScores[nonStriker?.index];
    setBatsmenScores(newScores);
    const newBalls = { ...batsmenBalls };
    delete newBalls[nonStriker?.index];
    setBatsmenBalls(newBalls);
    const newStats = { ...batsmenStats };
    delete newStats[nonStriker?.index];
    setBatsmenStats(newStats);
    setNonStriker(null);
    saveMatchData();
  };

  const cancelBatsmanDropdown = () => {
    setShowBatsmanDropdown(false);
    setPendingOut(false);
    setTopPlays(prev => prev.slice(0, -1));
    setCurrentOverBalls(prev => prev.slice(0, -1));
    setValidBalls(prev => Math.max(0, prev - 1));
    setWicketOvers(prev => prev.filter(w => w.batsmanIndex !== striker?.index));
    saveMatchData();
  };

  const updateWinnerInFirebase = async (winnerTeamName) => {
    if (!tournamentId || !teamA || !teamB || !matchId || !phase) {
      console.error('Missing required data to update winner:', { tournamentId, teamA, teamB, matchId, phase });
      return;
    }

    try {
      const tournamentRef = doc(db, 'roundrobin', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      if (!tournamentDoc.exists()) {
        console.error('Tournament not found.');
        return;
      }

      const tournamentData = tournamentDoc.data();
      let matchesToUpdate = [];
      let phaseKey = '';
      let matchIndex = -1;

      if (phase.includes('Group Stage')) {
        const groupNumber = phase.match(/Group Stage (\d+)/)?.[1];
        if (!groupNumber) {
          console.error('Invalid group stage phase:', phase);
          return;
        }
        phaseKey = `roundRobin.group_stage_${groupNumber}`;
        matchesToUpdate = tournamentData.roundRobin?.[`group_stage_${groupNumber}`] || [];
      } else if (phase.includes('Semi-Final')) {
        phaseKey = 'semiFinals';
        matchesToUpdate = Object.values(tournamentData.semiFinals || {});
      } else if (phase === 'Final') {
        phaseKey = 'finals';
        matchesToUpdate = Object.values(tournamentData.finals || {});
      } else {
        console.error('Invalid phase:', phase);
        return;
      }

      matchIndex = matchesToUpdate.findIndex(match =>
        match.id === matchId &&
        ((match.team1 === teamA.name && match.team2 === teamB.name) ||
         (match.team1 === teamB.name && match.team2 === teamA.name))
      );

      if (matchIndex === -1) {
        console.error('Match not found:', { matchId, teamA: teamA.name, teamB: teamB.name, phase });
        return;
      }

      if (phase.includes('Group Stage')) {
        const updatedMatches = [...matchesToUpdate];
        updatedMatches[matchIndex] = {
          ...updatedMatches[matchIndex],
          winner: winnerTeamName === 'Tie' ? 'Tie' : winnerTeamName
        };

        const groupNumber = phase.match(/Group Stage (\d+)/)?.[1];
        await updateDoc(tournamentRef, {
          [`roundRobin.group_stage_${groupNumber}`]: updatedMatches
        });
      } else if (phase.includes('Semi-Final')) {
        const updatePath = `semiFinals.match_${matchIndex + 1}.winner`;
        await updateDoc(tournamentRef, {
          [updatePath]: winnerTeamName === 'Tie' ? 'Tie' : winnerTeamName
        });
      } else if (phase === 'Final') {
        const updatePath = `finals.match_${matchIndex + 1}.winner`;
        await updateDoc(tournamentRef, {
          [updatePath]: winnerTeamName === 'Tie' ? 'Tie' : winnerTeamName
        });
      }

      if (winnerTeamName !== 'Tie') {
        const teams = tournamentData.teams || [];
        const teamIndex = teams.findIndex(team => team.teamName === winnerTeamName);
        if (teamIndex === -1) {
          console.error(`Team ${winnerTeamName} not found in teams array.`);
          return;
        }

        const updatedTeams = [...teams];
        const currentPoints = updatedTeams[teamIndex].points || 0;
        updatedTeams[teamIndex] = {
          ...updatedTeams[teamIndex],
          points: currentPoints + 2
        };

        await updateDoc(tournamentRef, {
          teams: updatedTeams
        });

        console.log(`Points updated: ${winnerTeamName} now has ${currentPoints + 2} points`);
      }

      console.log(`Winner updated: ${winnerTeamName} for match ${matchId} in ${phase}`);
    } catch (err) {
      console.error('Error updating winner in Firebase:', err);
    }
  };

  const handleModalOkClick = () => {
    setShowModal(false);

    if (gameFinished && modalContent.title === 'Match Result') {
      let winnerTeamName = '';
      let winningDifference = '';
      
      if (playerScore < targetScore - 1) {
        winnerTeamName = teamA.name;
        winningDifference = `${targetScore - 1 - playerScore} runs`;
      } else if (playerScore === targetScore - 1) {
        winnerTeamName = 'Tie';
        winningDifference = 'Tie';
      } else {
        winnerTeamName = teamB.name;
        winningDifference = `${10 - outCount} wickets`;
      }

      updateWinnerInFirebase(winnerTeamName);

      if (originPage) {
        navigate(originPage, { 
          state: { 
            activeTab: 'Match Results', 
            winner: winnerTeamName,
            winningDifference: winningDifference,
            tournamentId: tournamentId,
            tournamentName: tournamentName,
            teamA: {
              name: teamA.name,
              flagUrl: teamA.flagUrl,
              score: isChasing ? targetScore - 1 : playerScore,
              wickets: isChasing ? playedWickets : outCount,
              balls: isChasing ? playedOvers : (overNumber - 1) * 6 + validBalls
            },
            teamB: {
              name: teamB.name,
              flagUrl: teamB.flagUrl,
              score: isChasing ? playerScore : targetScore - 1,
              wickets: isChasing ? outCount : 0,
              balls: isChasing ? (overNumber - 1) * 6 + validBalls : 0
            }
          }
        });
      } else {
        navigate('/');
      }
    } else if (modalContent.title === 'Innings Break') {
      resetInnings();
      setIsChasing(true);
      setBowlerVisible(false);
      setCurrentView('toss');
      setShowThirdButtonOnly(false);
      setViewHistory(['toss']);
    }
  };

  if (!currentView && !showThirdButtonOnly) {
    return (
      <div className="text-white text-center p-4">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!teamA || !teamB) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading team data...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section
        className="w-full flex flex-col items-center"
        style={{
          backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {HeaderComponent ? <HeaderComponent /> : <div className="text-white">Header Missing</div>}

        {showAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center">
              {animationType === 'six' && (
                <Player
                  autoplay
                  loop={true}
                  src={sixAnimation}
                  style={{ width: '500px', height: '500px' }}
                />
              )}
              {animationType === 'four' && (
                <Player
                  autoplay
                  loop={true}
                  src={fourAnimation}
                  style={{ width: '500px', height: '500px' }}
                />
              )}
              {animationType === 'out' && (
                <Player
                  autoplay
                  loop={true}
                  src={outAnimation}
                  style={{ width: '500px', height: '500px' }}
                />
              )}
            </div>
          </div>
        )}

        {/* Wagon Wheel Modal */}
        {showWagonWheel && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl w-full max-w-2xl shadow-2xl border-4 border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {selectedRun !== null && `${selectedRun === 'W' ? 'Wicket' : `${selectedRun} Run${selectedRun !== 1 ? 's' : ''}`} - Select Shot Direction`}
                </h3>
                <button 
                  onClick={() => setShowWagonWheel(false)}
                  className="text-white hover:text-gray-300 text-2xl transition-transform hover:scale-110"
                >
                  ×
                </button>
              </div>
              
              {renderWagonWheel()}
              
              <div className="text-center text-gray-200 italic text-sm drop-shadow-md">
                Click on the fielding position where the ball went
              </div>
            </div>
          </div>
        )}

        {/* Shot Type Modal */}
        {showShotTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl w-full max-w-md shadow-2xl border-4 border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {selectedRun === 'W' ? 'Wicket' : `${selectedRun} Run${selectedRun !== 1 ? 's' : ''}`} - {selectedDirection.label} - Select Shot Type
                </h3>
                <button 
                  onClick={() => setShowShotTypeModal(false)}
                  className="text-white hover:text-gray-300 text-2xl transition-transform hover:scale-110"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {SHOT_TYPES.filter(shot => {
                  // Filter shots based on direction
                  if (selectedDirection.label.includes("Straight")) {
                    return ["drive", "loft", "defense"].includes(shot.class);
                  }
                  if (selectedDirection.label.includes("Cover")) {
                    return ["drive", "cut"].includes(shot.class);
                  }
                  if (selectedDirection.label.includes("Square")) {
                    return ["cut", "pull"].includes(shot.class);
                  }
                  return true;
                }).map((type) => (
                  <button
                    key={type.name}
                    onClick={() => handleShotTypeSelect(type)}
                    className="px-3 py-2 text-white rounded-lg font-medium text-sm 
                      transition-all duration-200 shadow hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trajectory Modal */}
        {showTrajectoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl w-full max-w-md shadow-2xl border-4 border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {selectedRun === 'W' ? 'Wicket' : `${selectedRun} Run${selectedRun !== 1 ? 's' : ''}`} - {selectedDirection.label} - {selectedShotType.name} - Select Ball Trajectory
                </h3>
                <button 
                  onClick={() => setShowTrajectoryModal(false)}
                  className="text-white hover:text-gray-300 text-2xl transition-transform hover:scale-110"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {TRAJECTORIES.map((trajectory) => (
                  <button
                    key={trajectory.name}
                    onClick={() => handleTrajectorySelect(trajectory)}
                    className="px-3 py-2 text-white rounded-lg font-medium text-sm 
                      transition-all duration-200 shadow hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: trajectory.color }}
                  >
                    {trajectory.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={goBack}
          className="absolute left-4 top-24 md:left-10 md:top-32 z-10 w-10 h-10 flex items-center justify-center"
        >
          <img
            alt="Back"
            className="w-6 h-6 transform rotate-180 mb-5"
            src={backButton}
            onError={(e) => (e.target.src = '')}
          />
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#4C0025] p-6 rounded-lg max-w-md w-full">
              {modalContent.title === 'Match Result' && (
                <canvas id="fireworks-canvas" className="absolute inset-0 w-full h-full z-0"></canvas>
              )}
              {modalContent.title === 'Match Result' && (
                <DotLottieReact
                  src="https://lottie.host/42c7d544-9ec0-4aaf-895f-3471daa49e49/a5beFhswU6.lottie"
                  style={{
                    position: 'absolute',
                    left: '0%',
                    top: '0%',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                  loop
                  autoplay
                />
              )}

              <h3 className="text-white text-xl font-bold mb-4 relative z-10">{modalContent.title}</h3>
              <p className="text-white mb-6 relative z-10">{modalContent.message}</p>
              <div className="flex justify-center relative z-10">
                <button
                  onClick={handleModalOkClick}
                  className="w-40 h-12 bg-[#FF62A1] text-white font-bold text-lg rounded-lg border-2 border-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'toss' && (
          <>
            <div id="toss" className="text-center mb-4">
              <h2 className="text-white font-bold text-3xl md:text-[3rem] mt-20 md:mt-6">
                {bowlerVisible ? (isChasing ? teamA.name : teamB.name) : (isChasing ? teamB.name : teamA.name)}
              </h2>
              <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F0167C] to-white text-center">
                {bowlerVisible ? (isChasing ? 'Choose the bowler' : 'Choose the Bowler') : 'Select Batsmen'}
              </h2>
            </div>

            <div className="flex gap-4">
              {!bowlerVisible && (
                <>
                  <div>
                    <button className="w-28 h-12 text-white text-lg md:w-25 md:h-10 font-bold bg-gradient-to-l from-[#12BFA5] to-[#000000] rounded-[1rem] shadow-lg">
                      Striker
                    </button>
                    {striker && (
                      <div className="relative text-white text-center mt-2 relative">
                        <div className="inline-block">
                          <img
                            src={striker.photoUrl} 
                            alt="Striker"
                            className="w-20 h-20 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-full mx-auto object-cover aspect-square"
                            onError={(e) => (e.target.src = '')}
                          />
                          <button
                            onClick={cancelStriker}
                            className="absolute -top-2 right-4 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <div>{striker.name}</div>
                        <div className="text-sm">{striker.role}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button className="w-28 h-12 text-white text-lg md:w-nbsp:h-10 md:h-10 font-bold bg-gradient-to-l from-[#12BFA5] to-[#000000] rounded-[1rem] shadow-lg">
                      Non-Striker
                    </button>
                    {nonStriker && (
                      <div className="relative text-white text-center mt-2 relative">
                        <div className=" inline-block">
                          <img
                            src={nonStriker.photoUrl} 
                            alt="Non-striker"
                            className="w-20 h-20 md:w-15 md:h-15 lg:w-10 lg:h-10 w-full"
                            onError={(e) => (e.target.src = '')}
                          />
                          <button
                            onClick={cancelNonStriker}
                            className="absolute -top-0 right-0 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <div>{nonStriker.name}</div>
                        <div className="text-sm">{nonStriker.role}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {!bowlerVisible && (striker === null || nonStriker === null) && (
              <div id="batsman-selection" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {getAvailableBatsmen().map((player) => (
                  <div
                    key={player.index}
                    onClick={() => handlePlayerSelect(player)}
                    className={`cursor-pointer flex flex-col items-center text-white text-center ${selectedBatsmenIndices.includes(player.index) ? 'opacity-50' : ''}`}
                  >
                    <div className="w-20 h-20 md:w-15 md:h-15 lg:w-15 lg:h-15 w-full rounded-full border-[5px] border-[#F0167C] overflow-hidden items-center justify-center aspect-square">
                      <img
                        src={player.photoUrl}
                        alt="Player"
                        className="w-full h-full object-cover aspect-square"
                        onError={(e) => (e.target.src = '')}
                      />
                    </div>
                    <span className="mt-2 font-bold text-lg">{player.name}</span>
                    <h2 className="text-sm font-light">{player.role}</h2>
                  </div>
                ))}
              </div>
            )}

            {striker && nonStriker && !bowlerVisible && (
              <button
                id="choosebowler"
                onClick={() => {
                  setBowlerVisible(true);
                  setViewHistory(prev => [...prev, 'bowler-selection']);
                }}
                className="w-30 rounded-3xl h-10 mt-4 bg-black text-white text-sm font-bold shadow-lg bg-[url('../assets/kumar/button.png')] transform transition duration-200 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                Choose Bowler
              </button>
            )}

            {selectedBowler && (
              <div className="relative inline-block text-center text-white">
                <img
                  src={selectedBowler.photoUrl} 
                  alt="Bowler"
                  className="w-20 h-20 md:w-15 md:h-15 lg:w-15 lg:h-15 rounded-full mx-auto object-cover aspect-square"
                  onError={(e) => (e.target.src = '')}
                />
                <div>{selectedBowler.name}</div>
                <div className="text-sm">{selectedBowler.role}</div>
              </div>
            )}

            {bowlerVisible && (
              <>
                <div id="bowler-selection" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {bowlingTeamPlayers.map((player) => (
                    <div
                      key={player.index}
                      onClick={() => handleBowlerSelect(player)}
                      className={`cursor-pointer flex flex-col items-center text-white text-center ${selectedBowler?.index === player.index ? 'opacity-50' : ''}`}
                    >
                      <div
                        className={`w-20 h-20 md:w-15 md:h-15 lg:w-15 md:w-15 h-15 rounded-full border-[5px] border-[#12BFA5] overflow-hidden flex items-center justify-center aspect-square w-full h-full`}
                      >
                        <img
                          src={player.photoUrl}
                          alt="Player"
                          className="w-full h-full object-cover aspect-square"
                          onError={(e) => (e.target.src = '')}
                        />
                      </div>
                      <span className="mt-2 font-bold text-lg">{player.name}</span>
                      <h2 className="text-sm font-light">{player.role}</h2>
                    </div>
                  ))}
                </div>

                {selectedBowler && (
                  <button
                    onClick={() => handleButtonClick('start')}
                    className="w-30 h-10 mt-4 text-white font-bold rounded-3xl bg-black bg-[url('../assets/kumar/button.png')] bg-cover bg-center shadow-lg transform transition duration-200 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                  >
                    Let's Play
                  </button>
                )}
              </>
            )}
          </>
        )}

        {showThirdButtonOnly && (
          <div id="start" className="relative flex flex-col w-full h-full items-center px-4 mt-20 md:mt-10">
            <h2 className="gap-5 text-white font-bold text-center text-4xl md:text-3xl lg:text-5xl">Score Board</h2>
            <div className="mt-4 flex w-full md:flex-row w-full md:w-1/2 justify-around gap-20 h-fit pt-2">
              <div className="flex items-center justify-center mb-4 md:mb-0">
                <img
                  src={isChasing ? teamB.flagUrl : teamA.flagUrl}
                  className="w-16 h-16 md:w-30 md:h-30 aspect-square"
                  alt="Team A Flag"
                  onError={(e) => (e.target.src = '')}
                />
                <div className="ml-4 md:ml-10">
                  <h3 className="text-white font-bold text-center text-sm md:text-2xl sm:text-3xl lg:text-4xl">
                    {playerScore} - {outCount}
                    <h2 className="text-base md:text-lg lg:text-xl sm:text-sm">{overNumber > maxOvers ? maxOvers : overNumber - 1}.{validBalls}</h2>
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center mb-4 md:mb-0">
                <div className="mr-4 md:mr-10">
                  <h3 className="text-white font-bold text-center text-lg md:text-2xl sm:text-3xl lg:text-4xl text-center text-yellow-300 underline">
                    {isChasing ? `Target: ${targetScore}` : 'Not yet'}
                  </h3>
                </div>
                <img
                  src={isChasing ? teamA.flagUrl : teamB.flagUrl}
                  className="w-16 h-16 md:w-30 md:h-30 aspect-square"
                  alt="Team B Flag"
                  onError={(e) => (e.target.src = '')}
                />
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row md:w-[50%] justify-around items-center justify-between mt-12">
              <div className="flex flex-row px-[4.8%] md:p-0 flex-row md:flex-row items-center justify-between gap-4 md:gap-8 mb-4 md:mb-0">
                <div className="text-center text-white">
                  <h3 className={`text-lg md:text-xl font-bold ${striker ? 'text-yellow-300' : ''}`}>Striker</h3>
                  {striker && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="font-bold text-sm md:text-base sm">{striker.name}</div>
                      <div className="text-xs md:text-sm">{striker.role}</div>
                      <div className="text-xs md:text-sm">
                        {batsmenScores[striker.index] || 0} ({batsmenBalls[striker.index] || 0})
                        <span className="text-yellow-300"> SR: {getStrikeRate(striker.index)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-white text-center">
                  <h3 className={`text-lg md:text-xl font-bold ${!striker ? 'text-yellow-300' : ''}`}>Non-Striker</h3>
                  {nonStriker && (
                    <div className="flex flex-col items-center w-full">
                      <div className="font-bold text-sm md:text-base">{nonStriker.name}</div>
                      <div className="text-xs md:text-sm">{nonStriker.role}</div>
                      <div className="text-xs md:text-sm">
                        {batsmenScores[nonStriker.index] || 0} ({batsmenBalls[nonStriker.index] || 0})
                        <span className="text-yellow-300"> SR: {getStrikeRate(nonStriker.index)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:hidden text-white text-center">
                  <h3 className="text-lg md:text-xl font-bold">Bowler</h3>
                  {selectedBowler && (
                    <div className="flex flex-col items-center">
                      <div className="font-bold text-sm md:text-base">{selectedBowler.name}</div>
                      <div className="text-xs md:text-sm">{selectedBowler.role}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end w-full md:w-[20%] mb-0 md:mb-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowPastOvers(showPastOvers => !showPastOvers)}
                    className="w-full md:w-32 h-10 md:h-12 bg-[#4C0025] text-white font-bold text-sm md:text-lg rounded-lg border-2 border-white"
                  >
                    {showPastOvers ? 'Hide Overs' : 'Show Overs'}
                  </button>
                </div>

                {showPastOvers && (
                  <div className="mt-2 md:mt-4 text-white w-full">
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-center">Overs History</h3>
                    <div className="bg-[#4C0025] p-3 rounded-lg inline-block" style={{ minHeight: '100px' }}>
                      <div className="flex items-center gap-3 flex-wrap">
                        {[...pastOvers, currentOverBalls.length > 0 ? currentOverBalls : null]
                          .filter(Boolean)
                          .map((over, index) => (
                            <div key={`over-${index}`} className="flex items-center gap-1">
                              {over.map((ball, ballIndex) => {
                                let displayBall = ball;
                                if (typeof ball === 'string' && ball.includes('+')) {
                                  const [type, runs] = ball.split('+');
                                  if (type.toLowerCase() === 'wd') displayBall = `Wd+${runs}`;
                                  else if (type.toLowerCase() === 'nb') displayBall = `Nb+${runs}`;
                                  else if (type.toLowerCase() === 'w') displayBall = `W+${runs}`;
                                  else displayBall = `${type}+${runs}`;
                                }

                                const isWicket = typeof ball === 'string' && (ball.includes('W') || ball.includes('O'));
                                return (
                                  <span
                                    key={`ball-${index}-${ballIndex}`}
                                    className={`w-6 h-6 flex items-center justify-center rounded-full px-1 text-xs md:text-sm whitespace-nowrap ${
                                      isWicket ? 'bg-red-600' : 'bg-[#FF62A1]'
                                    }`}
                                  >
                                    {displayBall}
                                  </span>
                                );
                              })}
                              {index !== pastOvers.length + (currentOverBalls.length > 0 ? 0 : -1) && (
                                <span className="text-white font-bold text-lg px-1">|</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden sm:block w-20 text-white text-center">
                <h3 className="text-lg md:text-xl font-bold">Bowler</h3>
                {selectedBowler && (
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-sm md:text-base">{selectedBowler.name}</div>
                    <div className="text-xs md:text-sm">{selectedBowler.role}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:gap-4">
              {[0, 1, 2, 3, 4, 6].map((num) => {
                const isActive = activeNumber === num;
                const isDisabled = pendingOut && num !== 0 && num !== 1 && num !== 2;
                return (
                  <button
                    key={num}
                    onClick={() => handleScoreButtonClick(num)}
                    className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                      ${isActive ? 'bg-green-500' : isDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#4C0025] hover:bg-green-300'}
                      text-white font-bold text-lg md:text-xl rounded-full border-2 border-white
                      flex items-center justify-center transition-colors duration-300`}
                    disabled={isDisabled}
                  >
                    {num}
                  </button>
                )
              })}
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-2 md:gap-4">
              {['Wide', 'No-ball', 'OUT', 'Leg By', 'nb'].map((label) => {
                const isActive = activeLabel === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleScoreButtonClick(label, true)}
                    className={`w-20 h-10 md:w-20 h-12 md:h-12
                      ${isActive ? 'bg-red-600' : 'bg-[#4C0025] hover:bg-gray-300'}
                      text-white font-bold text-sm md:text-lg sm:text-sm font-semibold rounded-lg border-2 border-white items-center justify-center cursor-pointer transition-opacity hover:opacity-80`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            {showRunInfo && (
              <p className="text-yellow-400 text-sm mt-2 text-center font-medium">
                {pendingOut ? 'Please select 0, 1, or 2 for runs on out' : 'Please select run, if not select 0'}
              </p>
            )}

            {showBatsmanDropdown && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#4C0025] p-4 md:p-6 rounded-lg max-w-md w-full mx-4 relative">
                  <button
                    onClick={cancelBatsmanDropdown}
                    className="absolute top-2 right-2 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-lg md:text-xl font-bold mb-4">Select Next Batsman</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {getAvailableBatsmen().map((player) => (
                      <div
                        key={player.index}
                        onClick={() => handleBatsmanSelect(player)}
                        className="cursor-pointer flex flex-col items-center text-white text-center p-2 hover:bg-[#FF62A1] rounded-lg"
                      >
                        <img
                          src={player.photoUrl}
                          alt="Player"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover aspect-square"
                          onError={(e) => (e.target.src = '')}
                        />
                        <span className="text-xs md:text-sm">{player.name}</span>
                        <span className="text-xs">{player.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showBowlerDropdown && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#4C0025] p-4 md:p-6 rounded-lg max-w-md w-full mx-4 relative">
                  <button
                    className="absolute top-2 right-2 w-6 h-6 text-white font-bold flex items-center justify-center text-xl"
                    onClick={() => setShowBowlerDropdown(false)}
                    >
                    ×
                  </button>
                  <h3 className="text-white text-lg md:text-xl font-bold mb-4">Select Next Bowler</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {bowlingTeamPlayers.filter(player => player.index !== selectedBowler?.index).map((player) => (
                      <div
                        key={player.index}
                        onClick={() => handleBowlerSelect(player)}
                        className="cursor-pointer flex flex-col items-center text-white text-center p-2 hover:bg-[#FF62A1] rounded-lg"
                      >
                        <img
                          src={player.photoUrl}
                          alt="Player"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover aspect-square"
                          onError={(e) => (e.target.src = '')}
                        />
                        <span className="text-xs md:text-sm">{player.name}</span>
                        <span className="text-xs">{player.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'startInnings' && !showThirdButtonOnly && (
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Innings Break</h2>
            <div className="text-2xl mb-8">
              <p className="text-center">First Innings Score: {playerScore}/{outCount}</p>
              <p className="text-center">Overs: {overNumber - 1}</p>
            </div>
            <button
              className="w-40 h-14 text-white text-lg font-bold bg-[url('../assets/kumar/button.png')] bg-cover bg-center shadow-lg"
              onClick={() => {
                setIsChasing(true);
                setTargetScore(playerScore + 1);
                setPlayedOvers(overNumber);
                setPlayedWickets(outCount);
                resetInnings();
                handleButtonClick('toss');
                saveMatchData();
              }}
            >
              Start Chase
            </button>
          </div>
        )}
      </section>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes ballFlight {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: 
              translate(
                calc(cos(var(--direction-angle) * 1deg) * var(--distance)),
                calc(sin(var(--direction-angle) * 1deg) * var(--distance) * -1)
              );
            opacity: 0;
          }
        }
        
        .animate-ball-flight {
          animation: ballFlight 0.8s ease-out forwards;
        }
      `}</style>
    </ErrorBoundary>
  );
}

export default StartMatchPlayersRoundRobin;