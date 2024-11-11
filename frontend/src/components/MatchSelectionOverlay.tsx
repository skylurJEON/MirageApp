import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';

interface League {
  id: string;
  name: string;
}

interface Match {
  id: string;
  date: string;
  homeTeam: {
    id: string;
    team_long_name: string;
  };
  awayTeam: {
    id: string;
    team_long_name: string;
  };
  home_team_goal: number;
  away_team_goal: number;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: string;
  overall_rating: number;
  preferred_foot: string;
  attacking_work_rate: string;
  defensive_work_rate: string;
  birthday: string;
  height: number;
  weight: number;
}

interface TeamPlayers {
  homeTeam: Player[];
  awayTeam: Player[];
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const MatchSelectionOverlay: React.FC<Props> = ({ isVisible, onClose }) => {
  const [step, setStep] = useState<'leagues' | 'matches' | 'players' | 'playerDetail'>('leagues');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<TeamPlayers>({ homeTeam: [], awayTeam: [] });
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTeamTab, setSelectedTeamTab] = useState<'home' | 'away'>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const API_URL = 'http://192.168.35.184:3000';

  useEffect(() => {
    if (isVisible) {
      fetchLeagues();
    }
  }, [isVisible]);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/leagues`);
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (leagueId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/matches?league_id=${leagueId}&limit=10`);
      const data = await response.json();
      setMatches(data.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async (matchId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/matches/${matchId}/players`);
      const data = await response.json();
      console.log('Players data:', data);
      
      setPlayers({
        homeTeam: data.homeTeam.players,
        awayTeam: data.awayTeam.players
      });
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    fetchMatches(league.id);
    setStep('matches');
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    fetchPlayers(match.id);
    setStep('players');
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setStep('playerDetail');
  };

  const handleBack = () => {
    if (step === 'playerDetail') {
      setStep('players');
      setSelectedPlayer(null);
    } else if (step === 'players') {
      setStep('matches');
      setPlayers({ homeTeam: [], awayTeam: [] });
    } else if (step === 'matches') {
      setStep('leagues');
      setMatches([]);
    }
  };

  const renderPlayerList = () => {
    const currentPlayers = selectedTeamTab === 'home' 
      ? players.homeTeam 
      : players.awayTeam;
    
    console.log('Current players:', currentPlayers);
    
    return (
      <FlatList
        data={currentPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.playerItem}
            onPress={() => handlePlayerSelect(item)}
          >
            <Text style={styles.numberText}>#{item.number}</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.positionText}>{item.position}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    switch (step) {
      case 'leagues':
        return (
          <>
            <Text style={styles.title}>리그 선택</Text>
            <FlatList
              data={leagues}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleLeagueSelect(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        );

      case 'matches':
        return (
          <>
            <Text style={styles.title}>{selectedLeague?.name} 경기</Text>
            <FlatList
              data={matches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleMatchSelect(item)}
                >
                  <Text style={styles.dateText}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.itemText}>
                    {item.homeTeam.team_long_name} {item.home_team_goal} - {item.away_team_goal} {item.awayTeam.team_long_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        );

      case 'players':
        return (
          <>
            <Text style={styles.title}>선수 명단</Text>
            <View style={styles.teamTabs}>
              <TouchableOpacity 
                style={[
                  styles.teamTab, 
                  selectedTeamTab === 'home' && styles.activeTeamTab
                ]}
                onPress={() => setSelectedTeamTab('home')}
              >
                <Text style={[
                  styles.teamTabText,
                  selectedTeamTab === 'home' && styles.activeTeamTabText
                ]}>
                  {selectedMatch?.homeTeam.team_long_name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.teamTab, 
                  selectedTeamTab === 'away' && styles.activeTeamTab
                ]}
                onPress={() => setSelectedTeamTab('away')}
              >
                <Text style={[
                  styles.teamTabText,
                  selectedTeamTab === 'away' && styles.activeTeamTabText
                ]}>
                  {selectedMatch?.awayTeam.team_long_name}
                </Text>
              </TouchableOpacity>
            </View>
            {renderPlayerList()}
          </>
        );

      case 'playerDetail':
        return (
          <>
            <Text style={styles.title}>선수 정보</Text>
            {selectedPlayer && (
              <View style={styles.playerDetailContainer}>
                <Text style={styles.playerDetailNumber}>#{selectedPlayer.number}</Text>
                <Text style={styles.playerDetailName}>{selectedPlayer.name}</Text>
                <Text style={styles.playerDetailInfo}>
                  포지션: {selectedPlayer.position}
                </Text>
                <Text style={styles.playerDetailInfo}>
                  생년월일: {new Date(selectedPlayer.birthday).toLocaleDateString()}
                </Text>
                <Text style={styles.playerDetailInfo}>
                  키: {selectedPlayer.height}cm
                </Text>
                <Text style={styles.playerDetailInfo}>
                  몸무게: {selectedPlayer.weight}kg
                </Text>
              </View>
            )}
          </>
        );
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            {step !== 'leagues' && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← 뒤로</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    top: '0%',
    left: '30%',
    right: '10%',
    bottom: '60%',
  },
  container: {
    width: '190%',
    height: '116%',
    backgroundColor: '#1a1a1a',
    //borderRadius: 15,
    padding: 20,
    position: 'absolute',
    top: '3%',
    left: '-27%',
  },


  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    //marginLeft: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 50,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    right: -12,
    top: -10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },


  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    marginLeft: '6%',
  },
  item: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
    marginLeft: '10%',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },


  teamTabs: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    width: '90%',
    alignSelf: 'center',
    marginLeft: '10%',
  },
  teamTab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTeamTab: {
    backgroundColor: '#007AFF',
  },
  teamTabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTeamTabText: {
    color: '#fff',
  },


  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    marginLeft: '10%',
  },
  numberText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
    width: 50,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  positionText: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },

  playerDetailContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    marginLeft: '10%',
  },
  playerDetailName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerDetailInfo: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  playerDetailNumber: {
    color: '#007AFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MatchSelectionOverlay;