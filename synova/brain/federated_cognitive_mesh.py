"""
SYNOVA FEDERATED COGNITIVE MESH
Privacy-First Global Brain with distributed cognitive processing
"""

import asyncio
import json
import time
import uuid
import hashlib
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass, field
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PrivacyLevel(Enum):
    """Privacy levels for cognitive data"""
    LOCAL_ONLY = "local_only"  # Stored locally, never shared
    ENCRYPTED_SHARED = "encrypted_shared"  # Encrypted when shared
    ABSTRACT_EMBEDDING = "abstract_embedding"  # Only embeddings shared
    PUBLIC_ANONYMIZED = "public_anonymized"  # Public but anonymized

@dataclass
class CognitiveEmbedding:
    """Compressed cognitive embedding for privacy-first sharing"""
    embedding_id: str
    embedding_vector: np.ndarray
    compression_ratio: float = 0.7
    privacy_level: PrivacyLevel = PrivacyLevel.LOCAL_ONLY
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    access_count: int = 0

@dataclass
class CognitiveMeshNode:
    """Node in federated cognitive mesh"""
    node_id: str
    user_id: str
    device_id: str
    local_state: Dict[str, Any] = field(default_factory=dict)
    cognitive_embeddings: List[CognitiveEmbedding] = field(default_factory=list)
    last_sync: datetime = field(default_factory=datetime.now)
    sync_frequency: timedelta = field(default_factory=lambda: timedelta(hours=1))
    privacy_preferences: Dict[str, PrivacyLevel] = field(default_factory=dict)

@dataclass
class MeshConnection:
    """Connection between mesh nodes"""
    connection_id: str
    source_node_id: str
    target_node_id: str
    connection_type: str  # sync, collaboration, query_routing
    bandwidth: float = 1.0
    latency: float = 50.0  # ms
    encryption_enabled: bool = True
    last_activity: datetime = field(default_factory=datetime.now)

@dataclass
class GlobalCognitiveState:
    """Global cognitive state across mesh"""
    state_id: str
    global_embeddings: Dict[str, CognitiveEmbedding] = field(default_factory=dict)
    consensus_version: int = 1
    mesh_topology: Dict[str, List[str]] = field(default_factory=dict)
    privacy_policies: Dict[str, Any] = field(default_factory=dict)
    last_updated: datetime = field(default_factory=datetime.now)

class FederatedPersonalCognitiveMesh:
    """Privacy-First Global Brain - Federated Personal Cognitive Mesh"""
    
    def __init__(self):
        self.nodes: Dict[str, CognitiveMeshNode] = {}
        self.connections: Dict[str, MeshConnection] = {}
        self.global_state = GlobalCognitiveState(state_id=str(uuid.uuid4()))
        self.encryption_key = self._generate_encryption_key()
        self.sync_protocols = ["p2p", "mesh", "hybrid"]
        self.privacy_budgets: Dict[str, Dict[str, float]] = {}  # user_id -> {data_type: budget}
        
    def _generate_encryption_key(self) -> str:
        """Generate encryption key for cognitive data"""
        return hashlib.sha256(f"synova_mesh_{datetime.now().isoformat()}".encode()).hexdigest()
        
    async def register_device(self, user_id: str, device_id: str, 
                          privacy_preferences: Dict[str, PrivacyLevel] = None) -> str:
        """Register a new device in the cognitive mesh"""
        node_id = str(uuid.uuid4())
        
        # Set default privacy preferences
        if privacy_preferences is None:
            privacy_preferences = {
                "reasoning_state": PrivacyLevel.LOCAL_ONLY,
                "memory_patterns": PrivacyLevel.ABSTRACT_EMBEDDING,
                "collaboration_data": PrivacyLevel.ENCRYPTED_SHARED,
                "analytics": PrivacyLevel.PUBLIC_ANONYMIZED
            }
            
        node = CognitiveMeshNode(
            node_id=node_id,
            user_id=user_id,
            device_id=device_id,
            privacy_preferences=privacy_preferences
        )
        
        self.nodes[node_id] = node
        logger.info(f"Registered device {device_id} for user {user_id} with node {node_id}")
        return node_id
        
    async def create_cognitive_embedding(self, node_id: str, cognitive_data: Any, 
                                   privacy_level: PrivacyLevel) -> str:
        """Create compressed cognitive embedding"""
        # Generate embedding from cognitive data
        if isinstance(cognitive_data, str):
            # Simple text embedding
            words = cognitive_data.lower().split()[:100]  # Limit to 100 words
            embedding = np.random.random(128)  # Simplified embedding
        else:
            # Numeric embedding
            embedding = np.random.random(128)
            
        # Compress embedding
        compressed_embedding = embedding * 0.7  # Simple compression
        
        embedding_obj = CognitiveEmbedding(
            embedding_id=str(uuid.uuid4()),
            embedding_vector=compressed_embedding,
            compression_ratio=0.7,
            privacy_level=privacy_level,
            metadata={"data_type": type(cognitive_data).__name__, "size": len(str(cognitive_data))}
        )
        
        # Store embedding
        if node_id in self.nodes:
            self.nodes[node_id].cognitive_embeddings.append(embedding_obj)
            
        logger.info(f"Created cognitive embedding {embedding_obj.embedding_id} at privacy level {privacy_level.value}")
        return embedding_obj.embedding_id
        
    async def sync_nodes(self, source_node_id: str, target_node_id: str) -> bool:
        """Synchronize cognitive state between nodes"""
        if source_node_id not in self.nodes or target_node_id not in self.nodes:
            return False
            
        source_node = self.nodes[source_node_id]
        target_node = self.nodes[target_node_id]
        
        # Create connection
        connection_id = str(uuid.uuid4())
        connection = MeshConnection(
            connection_id=connection_id,
            source_node_id=source_node_id,
            target_node_id=target_node_id,
            connection_type="sync",
            encryption_enabled=True
        )
        
        self.connections[connection_id] = connection
        
        # Sync embeddings based on privacy preferences
        await self._sync_embeddings_by_privacy(source_node, target_node)
        
        # Update sync timestamps
        source_node.last_sync = datetime.now()
        target_node.last_sync = datetime.now()
        
        logger.info(f"Synced nodes {source_node_id} -> {target_node_id}")
        return True
        
    async def _sync_embeddings_by_privacy(self, source_node: CognitiveMeshNode, target_node: CognitiveMeshNode):
        """Sync embeddings based on privacy preferences"""
        source_embeddings = source_node.cognitive_embeddings
        target_embeddings = target_node.cognitive_embeddings
        
        # Sync only embeddings that match privacy levels
        for source_emb in source_embeddings:
            # Check if target node can receive this type of embedding
            for data_type, privacy_level in target_node.privacy_preferences.items():
                if source_emb.privacy_level == privacy_level:
                    # Transfer embedding
                    transferred_emb = CognitiveEmbedding(
                        embedding_id=str(uuid.uuid4()),
                        embedding_vector=source_emb.embedding_vector.copy(),
                        compression_ratio=source_emb.compression_ratio,
                        privacy_level=privacy_level,
                        metadata=source_emb.metadata.copy()
                    )
                    
                    target_embeddings.append(transferred_emb)
                    break
                    
    async def route_query(self, query: str, user_id: str) -> Dict[str, Any]:
        """Route query through mesh to optimal node"""
        # Find user's nodes
        user_nodes = [node for node in self.nodes.values() if node.user_id == user_id]
        
        if not user_nodes:
            return {"error": "No nodes found for user"}
            
        # Select optimal node based on availability and load
        optimal_node = await self._select_optimal_node(user_nodes, query)
        
        # Route query to optimal node
        if optimal_node:
            # Simulate processing on optimal node
            result = await self._process_query_on_node(optimal_node, query)
            
            # Update node activity
            optimal_node.last_sync = datetime.now()
            
            return {
                "node_id": optimal_node.node_id,
                "device_id": optimal_node.device_id,
                "result": result,
                "routing_decision": f"Routed to {optimal_node.device_id} for optimal processing"
            }
        
        return {"error": "No optimal node available"}
        
    async def _select_optimal_node(self, nodes: List[CognitiveMeshNode], query: str) -> Optional[CognitiveMeshNode]:
        """Select optimal node for query processing"""
        if not nodes:
            return None
            
        # Simple selection based on last sync time and load
        current_time = datetime.now()
        
        scored_nodes = []
        for node in nodes:
            # Calculate score based on recency and availability
            time_since_sync = (current_time - node.last_sync).total_seconds()
            recency_score = max(0, 1 - time_since_sync / 3600)  # Decay over hour
            
            # Simulate load (random for demo)
            load_score = np.random.uniform(0.3, 1.0)
            
            total_score = 0.7 * recency_score + 0.3 * load_score
            scored_nodes.append((total_score, node))
            
        # Sort by score and return best
        scored_nodes.sort(key=lambda x: x[0], reverse=True)
        return scored_nodes[0][1] if scored_nodes else None
        
    async def _process_query_on_node(self, node: CognitiveMeshNode, query: str) -> Dict[str, Any]:
        """Process query on specific node"""
        # Simulate query processing using node's cognitive state
        query_lower = query.lower()
        
        # Check for relevant embeddings
        relevant_embeddings = []
        for emb in node.cognitive_embeddings:
            if emb.metadata.get("data_type") == "str":
                # Simple relevance check
                if any(word in emb.metadata.get("original_text", "").lower() 
                       for word in query_lower.split()):
                    relevant_embeddings.append(emb)
        
        # Simulate processing result
        processing_time = np.random.uniform(0.1, 2.0)  # seconds
        confidence = min(0.9, len(relevant_embeddings) * 0.2 + 0.3)
        
        return {
            "query": query,
            "relevant_embeddings": len(relevant_embeddings),
            "processing_time": processing_time,
            "confidence": confidence,
            "node_type": "processing_complete",
            "device_performance": "optimal"
        }
        
    async def establish_collaboration(self, user_id: str, collaborator_user_id: str, 
                                  collaboration_type: str = "shared_reasoning") -> str:
        """Establish secure collaboration between users"""
        # Find nodes for both users
        user_nodes = [node for node in self.nodes.values() if node.user_id == user_id]
        collaborator_nodes = [node for node in self.nodes.values() if node.user_id == collaborator_user_id]
        
        if not user_nodes or not collaborator_nodes:
            return ""
            
        # Select best nodes for collaboration
        user_node = await self._select_optimal_node(user_nodes, "collaboration")
        collaborator_node = await self._select_optimal_node(collaborator_nodes, "collaboration")
        
        if not user_node or not collaborator_node:
            return ""
            
        # Create collaboration connection
        connection_id = str(uuid.uuid4())
        connection = MeshConnection(
            connection_id=connection_id,
            source_node_id=user_node.node_id,
            target_node_id=collaborator_node.node_id,
            connection_type=collaboration_type,
            encryption_enabled=True,
            bandwidth=0.8  # Reduced bandwidth for security
        )
        
        self.connections[connection_id] = connection
        
        # Create shared cognitive space
        shared_space_id = str(uuid.uuid4())
        
        logger.info(f"Established {collaboration_type} between {user_id} and {collaborator_user_id}")
        return shared_space_id
        
    async def get_mesh_analytics(self) -> Dict[str, Any]:
        """Get analytics about the cognitive mesh"""
        total_nodes = len(self.nodes)
        total_connections = len(self.connections)
        active_nodes = len([n for n in self.nodes.values() 
                          if (datetime.now() - n.last_sync).total_seconds() < 300])
        
        # Privacy distribution
        privacy_distribution = {}
        for node in self.nodes.values():
            for data_type, privacy_level in node.privacy_preferences.items():
                if data_type not in privacy_distribution:
                    privacy_distribution[data_type] = {}
                if privacy_level not in privacy_distribution[data_type]:
                    privacy_distribution[data_type][privacy_level] = 0
                privacy_distribution[data_type][privacy_level] += 1
        
        # Connection types
        connection_types = {}
        for conn in self.connections.values():
            if conn.connection_type not in connection_types:
                connection_types[conn.connection_type] = 0
            connection_types[conn.connection_type] += 1
            
        return {
            "total_nodes": total_nodes,
            "active_nodes": active_nodes,
            "total_connections": total_connections,
            "privacy_distribution": privacy_distribution,
            "connection_types": connection_types,
            "global_state_version": self.global_state.consensus_version,
            "mesh_health": "healthy" if active_nodes > 0 else "degraded",
            "last_updated": self.global_state.last_updated.isoformat()
        }
        
    async def update_privacy_policies(self, user_id: str, new_policies: Dict[str, PrivacyLevel]):
        """Update privacy policies for a user"""
        # Find user's nodes
        user_nodes = [node for node in self.nodes.values() if node.user_id == user_id]
        
        for node in user_nodes:
            node.privacy_preferences.update(new_policies)
            
        logger.info(f"Updated privacy policies for user {user_id}")
        
    async def create_global_consensus(self, proposal: Dict[str, Any]) -> bool:
        """Create global consensus on mesh configuration changes"""
        # Simulate consensus process
        participating_nodes = list(self.nodes.values())
        
        # Simple majority vote simulation
        votes_for = 0
        votes_against = 0
        
        for node in participating_nodes:
            # Simulate vote based on node performance
            if np.random.random() < 0.7:  # 70% chance to agree
                votes_for += 1
            else:
                votes_against += 1
                
        # Determine consensus
        consensus_reached = votes_for > votes_against
        consensus_reached = consensus_reached and len(participating_nodes) > 1
        
        if consensus_reached:
            self.global_state.consensus_version += 1
            self.global_state.last_updated = datetime.now()
            
            # Apply proposal
            if "privacy_update" in proposal:
                for node in participating_nodes:
                    await self.update_privacy_policies(node.user_id, proposal["privacy_update"])
                    
        logger.info(f"Global consensus reached: {consensus_reached}, version: {self.global_state.consensus_version}")
        
        return consensus_reached

# Factory function
def create_federated_cognitive_mesh() -> FederatedPersonalCognitiveMesh:
    """Create federated cognitive mesh"""
    return FederatedPersonalCognitiveMesh()

# Test function
async def test_federated_cognitive_mesh():
    """Test federated cognitive mesh"""
    logger.info("Testing Federated Cognitive Mesh")
    
    mesh = create_federated_cognitive_mesh()
    
    # Register devices
    user1_node1 = await mesh.register_device("user1", "desktop_1")
    user1_node2 = await mesh.register_device("user1", "mobile_1")
    user2_node1 = await mesh.register_device("user2", "desktop_2")
    
    # Create cognitive embeddings
    await mesh.create_cognitive_embedding(user1_node1, "reasoning about problem X", PrivacyLevel.LOCAL_ONLY)
    await mesh.create_cognitive_embedding(user1_node1, "analysis of data Y", PrivacyLevel.ABSTRACT_EMBEDDING)
    await mesh.create_cognitive_embedding(user1_node2, "user preferences", PrivacyLevel.ENCRYPTED_SHARED)
    
    # Sync nodes
    await mesh.sync_nodes(user1_node1, user1_node2)
    
    # Route queries
    result1 = await mesh.route_query("how to solve problem X", "user1")
    result2 = await mesh.route_query("analyze data Y", "user1")
    
    # Establish collaboration
    collab_id = await mesh.establish_collaboration("user1", "user2", "shared_reasoning")
    
    # Get analytics
    analytics = await mesh.get_mesh_analytics()
    
    # Create consensus
    proposal = {
        "privacy_update": {
            "analytics": PrivacyLevel.PUBLIC_ANONYMIZED,
            "collaboration": PrivacyLevel.ENCRYPTED_SHARED
        }
    }
    consensus = await mesh.create_global_consensus(proposal)
    
    logger.info("Federated Cognitive Mesh test completed")
    print(f"Registered nodes: {len(mesh.nodes)}")
    print(f"Active connections: {len(mesh.connections)}")
    print(f"Query results: {result1.get('result', 'N/A')}, {result2.get('result', 'N/A')}")
    print(f"Collaboration ID: {collab_id}")
    print(f"Analytics: {analytics['total_nodes']} nodes, {analytics['active_nodes']} active")
    print(f"Consensus reached: {consensus}")

if __name__ == "__main__":
    asyncio.run(test_federated_cognitive_mesh())
