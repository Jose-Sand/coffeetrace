// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CoffeeTrace {
    struct Evento {
        string loteId;
        address actor;
        string accionHash;
        uint256 timestamp;
    }

    mapping(string => Evento[]) public eventosPorLote;
    Evento[] public todosLosEventos;

    event EventoRegistrado(
        string indexed loteId,
        address indexed actor,
        string accionHash,
        uint256 timestamp
    );

    function registrarEvento(
        string memory _loteId,
        string memory _accionHash
    ) public {
        Evento memory nuevoEvento = Evento({
            loteId: _loteId,
            actor: msg.sender,
            accionHash: _accionHash,
            timestamp: block.timestamp
        });

        eventosPorLote[_loteId].push(nuevoEvento);
        todosLosEventos.push(nuevoEvento);

        emit EventoRegistrado(_loteId, msg.sender, _accionHash, block.timestamp);
    }

    function obtenerEventos(string memory _loteId)
        public
        view
        returns (Evento[] memory)
    {
        return eventosPorLote[_loteId];
    }

    function totalEventos() public view returns (uint256) {
        return todosLosEventos.length;
    }
}
